import type { MaybeRefOrGetter } from 'vue'
import { computed, inject, nextTick, onUnmounted, toValue, useAttrs, watch } from 'vue'

import { dejaVueParentInstance } from '../constants'
import { Animation } from '../core/Animation'
import type { AnimationChild, AnimationNestableChild } from '../types'
import { toNonEmptyArray } from '../utils'

export type AnimationNestingTarget = (
  | { animation: Animation }
  | { callback: gsap.Callback }
  | { label: MaybeRefOrGetter<string | undefined> }
)

export function useAnimationNesting (target: AnimationNestingTarget | AnimationNestingTarget[], position?: MaybeRefOrGetter<gsap.Position | undefined>) {
  const attrs = useAttrs() as Pick<AnimationNestableChild, 'parent'>
  const parent = attrs.parent === null ? null : attrs.parent || inject(dejaVueParentInstance, null)
  const children = computed(() => toNonEmptyArray<AnimationChild>(
    [target]
      .flat()
      .map(child => {
        if ('animation' in child) return child.animation
        if ('callback' in child) return child.callback
        return toValue(child.label) || ''
      })
      .filter(Boolean)
  ))

  if (parent) {
    watch([children, () => toValue(position)], async ([currentChildren, currentPosition], [previousChildren, previousPosition]) => {
      if (!currentChildren && !previousChildren) return
      previousChildren?.slice(currentChildren?.length || 0).forEach(child => parent.animation.remove(child))
      if (!currentChildren) return
      await nextTick()
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
      children.value.forEach(child => parent.animation.remove(child))
    } else {
      children.value.forEach(child => child instanceof Animation && child.dispose())
    }
  })

  return {
    parent
  }
}
