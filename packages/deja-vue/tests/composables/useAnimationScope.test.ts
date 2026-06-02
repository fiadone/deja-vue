import { flushPromises, mount } from '@vue/test-utils'
import { gsap } from 'gsap'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Timeline from '../../src/components/Timeline.vue'
import Tween from '../../src/components/Tween.vue'
import { resolveChildrenTweenTarget } from '../../src/composables/useAnimationScope'
import type { DejaVueAnimationInstance } from '../../src/types'
import {
  expectTweenTargetNonEmpty,
  getExposed,
  getTweenExposed,
  mountTimeline,
  mountTimelineWithTween,
  TWEEN_TARGET_CLASS
} from '../shared/helpers'

describe('resolveChildrenTweenTarget', () => {
  it('maps seamless children to their tweenTarget', () => {
    const el = document.createElement('div')
    expect(resolveChildrenTweenTarget([{ seamless: true, tweenTarget: el }] as never)).toEqual([el])
  })

  it('maps non-seamless children through getNodeElement', () => {
    const el = document.createElement('span')
    expect(resolveChildrenTweenTarget([{ $el: el }] as never)).toEqual([el])
  })
})

describe('useAnimationScope', () => {
  it('resolves tweenTarget from mounted Tween children', async () => {
    const wrapper = await mountTimelineWithTween()
    expect(getTweenExposed(wrapper).tweenTarget).toBeTruthy()
    wrapper.unmount()
  })

  it('resolves tweenTarget from children when tweenTarget is children', async () => {
    const wrapper = await mountTimelineWithTween({ to: { duration: 0.1 }, tweenTarget: 'children' })
    expectTweenTargetNonEmpty(wrapper)
    wrapper.unmount()
  })

  it('uses a non-string tweenTarget as-is', async () => {
    const el = document.createElement('article')
    const wrapper = await mountTimeline({
      attrs: { is: 'div' },
      props: { tweenTarget: el },
      slots: { default: () => h('div', { class: 'scope-root' }) }
    })

    expect(getExposed<DejaVueAnimationInstance>(wrapper).tweenTarget).toEqual(el)
    wrapper.unmount()
  })

  it('resolves tweenTarget to self with is and tweenTarget=self', async () => {
    const wrapper = await mountTimeline({
      attrs: { is: 'div' },
      props: { tweenTarget: 'self' },
      slots: { default: () => h('div', { class: 'scope-root' }, 'root') }
    })

    expect(getExposed<DejaVueAnimationInstance>(wrapper).tweenTarget).toBeTruthy()
    wrapper.unmount()
  })

  it('resolves tweenTarget with a scoped DOM selector', async () => {
    const wrapper = await mountTimeline({
      attrs: { is: 'div' },
      props: { tweenTarget: '.inner' },
      slots: {
        default: () => h('div', { class: 'scope-root' }, [h('span', { class: 'inner' }, 'hit')])
      }
    })

    expect(getExposed<DejaVueAnimationInstance>(wrapper).tweenTarget).toEqual(
      expect.arrayContaining([expect.objectContaining({ className: expect.stringContaining('inner') })])
    )
    wrapper.unmount()
  })

  it('kills tweens on the previous target when children change', async () => {
    const kill = vi.spyOn(gsap, 'killTweensOf')
    const phase = ref(0)
    const Host = defineComponent({
      setup () {
        return () => h(Timeline, null, {
          default: () => h(Tween, { to: { duration: 0.1, opacity: 1 } }, {
            default: () => (phase.value === 0
              ? h('div', { class: TWEEN_TARGET_CLASS })
              : h('section', { class: TWEEN_TARGET_CLASS }))
          })
        })
      }
    })

    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    phase.value = 1
    await flushPromises()

    expect(kill).toHaveBeenCalled()
    kill.mockRestore()
    wrapper.unmount()
  })
})
