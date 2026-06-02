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
    watch([children, () => toValue(options?.position)], async ([currentChildren, currentPosition], [previousChildren, previousPosition], onCleanup) => {
      let skip = false
      onCleanup(() => (skip = true))
      if (!currentChildren && !previousChildren) return
      previousChildren?.slice(currentChildren?.length || 0).forEach(child => parent.animation.remove(child))
      if (!currentChildren) return
      await nextTick()
      if (skip) return // skip this execution because children/position have changed again in the meantime
      currentChildren.forEach((child, index) => {
        if (child === previousChildren?.[index] && currentPosition === previousPosition) return
        if (previousChildren?.[index]) parent.animation.remove(previousChildren[index])
        parent.animation.add(child, currentPosition)
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
