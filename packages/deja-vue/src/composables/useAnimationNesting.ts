import type { MaybeRefOrGetter } from 'vue'
import { computed, inject, nextTick, onUnmounted, toValue, watch } from 'vue'

import { dejaVueParentInstance } from '../constants'
import { Animation } from '../core/Animation'
import type { AnimationChild, DejaVueAnimationParent } from '../types'
import { toNonEmptyArray } from '../utils'

export interface AnimationNestingOptions {
  parent?: DejaVueAnimationParent | null
  position?: MaybeRefOrGetter<gsap.Position | undefined>
}

export type AnimationNestingTarget = (
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }
)

export function useAnimationNesting (target?: AnimationNestingTarget | AnimationNestingTarget[], options?: AnimationNestingOptions) {
  const parent = options?.parent === null ? null : options?.parent || inject(dejaVueParentInstance, null)
  const position = computed(() => toValue(options?.position))
  const children = computed(() => toNonEmptyArray<AnimationChild>(
    [target]
      .flat()
      .map(child => {
        if (!child) return ''
        if ('animation' in child) return child.animation
        if ('callback' in child) return child.callback
        return toValue(child.label) || ''
      })
      .filter(Boolean)
  ))

  if (parent) {
    watch([children, position], async ([currentChildren, currentPosition], [previousChildren, previousPosition], onCleanup) => {
      let skip = false

      onCleanup(() => (skip = true))

      if (!currentChildren && !previousChildren) return

      if (!currentChildren) {
        previousChildren!.forEach(child => parent.animation.remove(child))
        return
      }

      if (previousChildren && currentChildren.length < previousChildren.length) {
        previousChildren.slice(currentChildren.length).forEach(child => parent.animation.remove(child))
      }

      await nextTick()

      /* v8 ignore next */
      if (skip) return

      currentChildren.forEach((currentChild, index) => {
        const previousChild = previousChildren?.[index]
        if (currentChild === previousChild && currentPosition === previousPosition) return
        if (previousChild) parent.animation.remove(previousChild)
        parent.animation.add(currentChild, currentPosition)
      })
    }, { immediate: true })
  }

  onUnmounted(() => {
    if (!children.value) return
    if (parent) {
      children.value.forEach(child => {
        parent.animation.remove(child, true)
        if (child instanceof Animation) child.dispose()
      })
    } else {
      children.value.forEach(child => child instanceof Animation && child.dispose())
    }
  })

  return {
    parent
  }
}
