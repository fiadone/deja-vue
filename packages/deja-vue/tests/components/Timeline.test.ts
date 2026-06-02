import { flushPromises } from '@vue/test-utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Timeline from '../../src/components/Timeline.vue'
import { ANIMATION_EVENTS } from '../../src/constants'
import { Animation } from '../../src/core/Animation'
import type { DejaVueAnimationInstance } from '../../src/types'
import {
  getExposed,
  getTweenExposed,
  mountTimeline,
  mountTimelineWithTween,
  nestedTimelines
} from '../shared/helpers'

describe('Timeline', () => {
  describe('instance', () => {
    it('exposes a DejaVue animation instance', async () => {
      const wrapper = await mountTimeline()
      const instance = getExposed<DejaVueAnimationInstance>(wrapper)

      expect(instance.animation.timeline).toBeDefined()
      wrapper.unmount()
    })

    it('provides itself as the parent for descendants', async () => {
      const wrapper = await mountTimelineWithTween()
      const parent = getExposed<DejaVueAnimationInstance>(wrapper)
      const child = getTweenExposed(wrapper)

      expect(child.parent?.animation).toBe(parent.animation)
      expect(nestedTimelines(parent.animation)).toContain(child.animation.timeline)
      wrapper.unmount()
    })

    it('nests a child timeline with position', async () => {
      const wrapper = await mountTimeline({
        slots: {
          default: () => h(Timeline, { position: 0.5 }, { default: () => h('div', 'nested') })
        }
      })
      const parent = getExposed<DejaVueAnimationInstance>(wrapper)

      expect(nestedTimelines(parent.animation)).toHaveLength(1)
      wrapper.unmount()
    })

    it('exposes seamless from props', async () => {
      const wrapper = await mountTimeline({ props: { seamless: true } })
      expect(getExposed<DejaVueAnimationInstance>(wrapper).seamless).toBe(true)
      wrapper.unmount()
    })
  })

  describe('duration', () => {
    it('applies duration to the timeline data', async () => {
      const wrapper = await mountTimeline({ props: { duration: 5 } })
      expect(getExposed<DejaVueAnimationInstance>(wrapper).animation.timeline.data.totalDuration).toBe(5)
      wrapper.unmount()
    })

    it('applies duration when the prop is set after mount', async () => {
      const wrapper = await mountTimeline({ props: { options: { data: {} } } })
      const instance = getExposed<DejaVueAnimationInstance>(wrapper)

      await wrapper.setProps({ duration: 4 })
      await flushPromises()

      expect(instance.animation.timeline.data.totalDuration).toBe(4)
      wrapper.unmount()
    })

    it('clears duration and resets timeScale when duration is removed', async () => {
      const wrapper = await mountTimeline({ props: { duration: 5 } })
      const instance = getExposed<DejaVueAnimationInstance>(wrapper)

      await wrapper.setProps({ duration: undefined })
      await flushPromises()

      expect(instance.animation.timeline.data.totalDuration).toBeUndefined()
      expect(instance.animation.timeline.timeScale()).toBe(1)
      wrapper.unmount()
    })
  })

  describe('options', () => {
    it('invalidates the timeline when options change', async () => {
      const wrapper = await mountTimeline({ props: { options: { delay: 0 } } })
      const invalidate = vi.spyOn(getExposed<DejaVueAnimationInstance>(wrapper).animation.timeline, 'invalidate')

      await wrapper.setProps({ options: { delay: 0.5 } })
      await flushPromises()

      expect(invalidate).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('ScrollTrigger', () => {
    it('attaches ScrollTrigger from timeline options', async () => {
      const create = vi.spyOn(ScrollTrigger, 'create').mockReturnValue({ kill: vi.fn() } as unknown as ScrollTrigger)
      const wrapper = await mountTimeline({
        props: { options: { scrollTrigger: { start: 'top center' } } },
        slots: { default: () => h('div') }
      })

      expect(create).toHaveBeenCalled()
      create.mockRestore()
      wrapper.unmount()
    })

    it('detaches ScrollTrigger when scroll vars are removed', async () => {
      const kill = vi.fn()
      const create = vi.spyOn(ScrollTrigger, 'create').mockReturnValue({ kill } as unknown as ScrollTrigger)
      const wrapper = await mountTimeline({
        props: { options: { scrollTrigger: { start: 'top' } } },
        slots: { default: () => h('div') }
      })

      await wrapper.setProps({ options: {} })
      await flushPromises()

      expect(kill).toHaveBeenCalled()
      create.mockRestore()
      wrapper.unmount()
    })
  })

  describe('events', () => {
    it.each(ANIMATION_EVENTS)('emits %s from the animation bus', async event => {
      const wrapper = await mountTimeline()
      const instance = getExposed<DejaVueAnimationInstance>(wrapper)

      instance.animation.dispatch(event, instance.animation)
      expect(wrapper.emitted(event)?.[0]).toEqual([instance.animation, null])
      wrapper.unmount()
    })
  })

  describe('controls', () => {
    it('runs trigger controls with a custom action', async () => {
      const run = vi.spyOn(Animation.prototype, 'run')
      const wrapper = await mountTimeline({
        props: {
          trigger: false,
          triggerAction: 'pause',
          triggerOptions: { immediate: true }
        }
      })

      await wrapper.setProps({ trigger: true })
      await flushPromises()

      expect(run).toHaveBeenCalledWith('pause')
      run.mockRestore()
      wrapper.unmount()
    })
  })
})
