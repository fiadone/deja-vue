import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Timeline from '../../src/components/Timeline.vue'
import Tween from '../../src/components/Tween.vue'
import { Animation } from '../../src/core/Animation'
import type { DejaVueAnimationInstance } from '../../src/types'
import {
  getExposed,
  getTweenExposed,
  mountTimeline,
  mountTimelineWithTween,
  tweenTargetSlot
} from '../shared/helpers'

describe('Tween', () => {
  describe('instance', () => {
    it('exposes animation state and composes on the target', async () => {
      const wrapper = await mountTimelineWithTween({ to: { duration: 0.1, opacity: 0.5 } })
      const instance = getTweenExposed(wrapper)

      expect(instance.controlled).toBe(false)
      expect(instance.tweenTarget).toBeTruthy()
      expect(instance.animation.timeline.getChildren().length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    it('nests under the parent timeline', async () => {
      const wrapper = await mountTimelineWithTween()
      const parent = getExposed<DejaVueAnimationInstance>(wrapper)
      const child = getTweenExposed(wrapper)

      expect(child.parent?.animation).toBe(parent.animation)
      wrapper.unmount()
    })

    it('exposes seamless from props', async () => {
      const wrapper = await mountTimelineWithTween({ seamless: true, to: { duration: 0.1 } })
      expect(getTweenExposed(wrapper).seamless).toBe(true)
      wrapper.unmount()
    })
  })

  describe('compose', () => {
    it('skips compose when there is no tween target', async () => {
      const wrapper = await mountTimeline({
        slots: { default: () => h(Tween, { to: { duration: 0.1, opacity: 1 } }) }
      })
      const instance = getTweenExposed(wrapper)

      expect(instance.tweenTarget).toBeNull()
      expect(instance.animation.timeline.getChildren()).toHaveLength(0)
      wrapper.unmount()
    })

    it('recomposes when tween vars change', async () => {
      const to = ref({ duration: 0.1, x: 0 })
      const Host = defineComponent({
        setup () {
          return () => h(Timeline, null, {
            default: () => h(Tween, { to: to.value }, { default: tweenTargetSlot })
          })
        }
      })

      const wrapper = mount(Host, { attachTo: document.body })
      await flushPromises()
      const instance = getTweenExposed(wrapper)
      const before = instance.animation.timeline.getChildren().length

      to.value = { duration: 0.1, x: 100 }
      await flushPromises()

      expect(instance.animation.timeline.getChildren().length).toBeGreaterThanOrEqual(before)
      wrapper.unmount()
    })

    it('passes revertOnDispose to animation.clear on recompose', async () => {
      const to = ref({ duration: 0.1, x: 0 })
      const clear = vi.spyOn(Animation.prototype, 'clear')
      const Host = defineComponent({
        setup () {
          return () => h(Timeline, null, {
            default: () => h(Tween, { revertOnDispose: true, to: to.value }, { default: tweenTargetSlot })
          })
        }
      })

      const wrapper = mount(Host, { attachTo: document.body })
      await flushPromises()

      to.value = { duration: 0.1, x: 100 }
      await flushPromises()

      expect(clear).toHaveBeenCalledWith(true)
      clear.mockRestore()
      wrapper.unmount()
    })
  })

  describe('controls', () => {
    it('enters controlled mode when progress is set', async () => {
      const wrapper = await mountTimelineWithTween({ progress: 0, to: { duration: 0.1, x: 10 } })
      const instance = getTweenExposed(wrapper)

      expect(instance.controlled).toBe(true)
      expect(instance.animation.timeline.paused()).toBe(true)
      wrapper.unmount()
    })

    it('forwards trigger options to animation controls', async () => {
      const run = vi.spyOn(Animation.prototype, 'run')
      const trigger = ref(false)
      const Host = defineComponent({
        setup () {
          return () => h(Timeline, null, {
            default: () => h(Tween, {
              to: { duration: 0.1 },
              trigger: trigger.value,
              triggerAction: 'reverse',
              triggerOptions: { immediate: true }
            }, { default: tweenTargetSlot })
          })
        }
      })

      const wrapper = mount(Host, { attachTo: document.body })
      await flushPromises()
      trigger.value = true
      await flushPromises()

      expect(run).toHaveBeenCalledWith('reverse')
      run.mockRestore()
      wrapper.unmount()
    })
  })
})
