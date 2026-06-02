import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { gsap } from 'gsap'
import { expect } from 'vitest'
import type { ModelRef, VNode } from 'vue'
import { defineComponent, h, provide, ref, shallowRef } from 'vue'

import Marker from '../../src/components/Marker.vue'
import SplitText from '../../src/components/SplitText.vue'
import Timeline from '../../src/components/Timeline.vue'
import Tween from '../../src/components/Tween.vue'
import type { AnimationControls } from '../../src/composables/useAnimationControls'
import { dejaVueParentInstance } from '../../src/constants'
import { Animation } from '../../src/core/Animation'
import type { DejaVueAnimationExposed, DejaVueAnimationInstance } from '../../src/types'

export const TWEEN_TARGET_CLASS = 'deja-tween-target'

function mountHost (setupFn: () => void, parent?: DejaVueAnimationInstance) {
  return mount(defineComponent({
    name: 'TestHost',
    setup () {
      if (parent) provide(dejaVueParentInstance, parent)
      return () => h({
        name: 'TestChild',
        setup () {
          setupFn()
          return () => h('div')
        }
      })
    }
  }))
}

export function nestedTimelines (parent: Animation) {
  return parent.timeline.getChildren().filter(child => child instanceof gsap.core.Timeline)
}

export function modelRef<T> (value: T) {
  return ref(value) as ModelRef<T>
}

export function createParent () {
  const animation = new Animation()
  const instance = {
    $el: shallowRef(null),
    animation,
    tweenTarget: shallowRef(document.createElement('div'))
  } as unknown as DejaVueAnimationInstance

  return { animation, instance }
}

export function mountWithParent (setup: () => void, instance: DejaVueAnimationInstance) {
  return mountHost(setup, instance)
}

export function runComposable<T> (composable: () => T) {
  let result!: T
  const wrapper = mountHost(() => {
    result = composable()
  })

  return { result, unmount: () => wrapper.unmount() }
}

export function controls (overrides: Partial<AnimationControls> = {}): AnimationControls {
  return {
    progress: modelRef<number | undefined>(0),
    trigger: undefined,
    triggerAction: undefined,
    triggerOptions: undefined,
    ...overrides
  }
}

export function getExposed<T> (wrapper: VueWrapper) {
  return wrapper.vm as T
}

export function getTweenExposed (wrapper: VueWrapper) {
  return getExposed<DejaVueAnimationExposed>(wrapper.findComponent(Tween))
}

export function expectTweenTargetNonEmpty (wrapper: VueWrapper) {
  const { tweenTarget } = getTweenExposed(wrapper)
  const elements = Array.isArray(tweenTarget) ? tweenTarget : []
  expect(elements.length).toBeGreaterThan(0)
  return elements
}

export function tweenTargetSlot () {
  return h('div', { class: TWEEN_TARGET_CLASS })
}

export async function mountTimeline (options?: {
  attrs?: Record<string, unknown>
  props?: Record<string, unknown>
  slots?: { default?: () => VNode | VNode[] }
}) {
  const wrapper = mount(Timeline, {
    attachTo: document.body,
    attrs: options?.attrs,
    props: options?.props,
    slots: options?.slots ?? { default: () => h('div') }
  })
  await flushPromises()
  return wrapper
}

export async function mountTimelineWithTween (
  tweenProps: Record<string, unknown> = { to: { duration: 0.1, opacity: 1 } },
  timelineProps?: Record<string, unknown>
) {
  return mountTimeline({
    props: timelineProps,
    slots: {
      default: () => h(Tween, tweenProps, { default: tweenTargetSlot })
    }
  })
}

export async function mountTimelineWithMarker (
  markerProps: Record<string, unknown> = { label: 'mark' },
  timelineProps?: Record<string, unknown>
) {
  return mountTimeline({
    props: timelineProps,
    slots: {
      default: () => h(Marker, markerProps, { default: () => h('span') })
    }
  })
}

export async function mountSplitText (options: {
  attrs?: Record<string, unknown>
  props?: Record<string, unknown>
  slots?: { default?: () => VNode }
} = { props: { type: 'words' } }) {
  const wrapper = mount(SplitText, {
    attachTo: document.body,
    attrs: options.attrs,
    props: options.props ?? { type: 'words' },
    slots: options.slots ?? { default: () => h('p', { class: 'split-copy' }, 'Hello world') }
  })
  await flushPromises()
  return wrapper
}
