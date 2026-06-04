import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import type { DejaVueMarkerInstance } from '../../src/components/Marker.types'
import Marker from '../../src/components/Marker.vue'
import Timeline from '../../src/components/Timeline.vue'
import Tween from '../../src/components/Tween.vue'
import type { DejaVueAnimationInstance } from '../../src/types'
import { getExposed, mountTimeline, mountTimelineWithMarker } from '../shared/helpers'

describe('Marker', () => {
  it('registers a label and callback on the parent timeline', async () => {
    const wrapper = await mountTimelineWithMarker({ label: 'intro' })
    const parent = getExposed<DejaVueAnimationInstance>(wrapper)

    expect(parent.animation.timeline.labels).toHaveProperty('intro')
    expect(parent.animation.timeline.getChildren().length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('updates the label when the prop changes', async () => {
    const label = ref('a')
    const Host = defineComponent({
      setup () {
        return () => h(Timeline, null, {
          default: () => h(Marker, { label: label.value, position: 0 }, { default: () => h('span') })
        })
      }
    })

    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    const parent = getExposed<DejaVueAnimationInstance>(wrapper.findComponent(Timeline))

    label.value = 'b'
    await flushPromises()

    expect(parent.animation.timeline.labels).toHaveProperty('b')
    expect(parent.animation.timeline.labels).not.toHaveProperty('a')
    wrapper.unmount()
  })

  it('treats crossed position as zero when the callback is not on the timeline yet', async () => {
    const Host = defineComponent({
      setup () {
        return () => h(Timeline, null, {
          default: () => h(Marker, { position: 0.5 }, { default: () => h('span') })
        })
      }
    })

    const wrapper = mount(Host, { attachTo: document.body })
    await flushPromises()
    const parent = getExposed<DejaVueAnimationInstance>(wrapper.findComponent(Timeline))
    const marker = wrapper.findComponent(Marker)
    const instance = getExposed<DejaVueMarkerInstance>(marker)
    const getChildPosition = vi.spyOn(parent.animation, 'getChildPosition').mockReturnValue(undefined)

    parent.animation.timeline.pause(0.6)
    parent.animation.dispatch('update', parent.animation)
    await flushPromises()

    expect(instance.crossed).toBe(true)
    getChildPosition.mockRestore()
    wrapper.unmount()
  })

  it('emits cross on callback and tracks crossed from playhead position', async () => {
    const wrapper = await mountTimeline({
      slots: {
        default: () => [
          h(Tween, { to: { duration: 1, ease: 'none' } }, { default: () => h('div') }),
          h(Marker, { label: 'mid', position: 0.5 }, { default: () => h('span') })
        ]
      }
    })
    const parent = getExposed<DejaVueAnimationInstance>(wrapper)
    const marker = wrapper.findComponent(Marker)
    const instance = getExposed<DejaVueMarkerInstance>(marker)

    parent.animation.timeline.pause(0)
    parent.animation.dispatch('update', parent.animation)
    await flushPromises()
    expect(instance.crossed).toBe(false)

    parent.animation.timeline.play(0)
    parent.animation.timeline.progress(0.6)
    parent.animation.dispatch('update', parent.animation)
    await flushPromises()

    const direction = marker.emitted('cross')?.[0]?.[0] as number
    expect(direction).toBeDefined()
    expect(instance.crossed).toBe(true)

    parent.animation.timeline.progress(0.3)
    parent.animation.dispatch('update', parent.animation)
    await flushPromises()
    expect(instance.crossed).toBe(false)

    wrapper.unmount()
  })
})
