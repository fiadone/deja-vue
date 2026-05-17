import { gsap } from 'gsap'
import type { PropType } from 'vue'
import { computed, useAttrs, watch } from 'vue'
import { getNodeElement, useUnwrap } from 'vue-unwrap'

import type { DejaVueInstanceExposed, DejaVueNode, WrappableAnimation } from '../types'
import { toNonEmptyArray } from '../utils'

type AnimationScopeProps = Omit<DejaVueInstanceExposed, '$el'>

const AnimationScopePropTypes = {
  animation: Object as PropType<DejaVueInstanceExposed['animation']>,
  controlled: Boolean as PropType<DejaVueInstanceExposed['controlled']>,
  direction: Number as PropType<DejaVueInstanceExposed['direction']>,
  parent: Object as PropType<DejaVueInstanceExposed['parent']>,
  progress: Number as PropType<DejaVueInstanceExposed['progress']>,
  seamless: Boolean as PropType<DejaVueInstanceExposed['seamless']>,
  target: [String, Object] as PropType<gsap.TweenTarget>,
}

export function resolveChildrenTarget (children: DejaVueNode[]) {
  return (
    children
      .map(child => (child && 'seamless' in child && child.seamless) ? child.target : getNodeElement(child))
      .flat()
      .filter(Boolean)
  )
}

export function useAnimationScope (childrenTargetResolver = resolveChildrenTarget) {
  const attrs = useAttrs() as WrappableAnimation
  const { $el, children, Unwrap: AnimationScope } = useUnwrap<DejaVueNode, AnimationScopeProps>(AnimationScopePropTypes)
  const target = computed<gsap.TweenTarget>(() => {
    if (attrs.target && typeof attrs.target !== 'string') return attrs.target
    if (!attrs.is || attrs.target === 'children') return toNonEmptyArray(childrenTargetResolver(children))
    if (!attrs.target || attrs.target === 'self') return $el.value
    return toNonEmptyArray(gsap.utils.toArray<Element>(attrs.target, $el.value)) // ensure scoped DOM query selection
  })

  watch(target, (_, previousTarget) => {
    if (!previousTarget) return
    gsap.killTweensOf(previousTarget)
    gsap.set(previousTarget, { clearProps: true })
  })

  return {
    $el,
    target,
    AnimationScope
  }
}
