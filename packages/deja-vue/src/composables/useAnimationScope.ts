import { gsap } from 'gsap'
import type { MaybeRefOrGetter, PropType } from 'vue'
import { computed, toValue, useAttrs, watch } from 'vue'
import { getNodeElement, useUnwrap } from 'vue-unwrap'

import type { DejaVueAnimationScopeProps, DejaVueNode, WrappableComponent } from '../types'
import { toNonEmptyArray } from '../utils'

export interface AnimationScopeOptions {
  resolveChildrenTweenTarget?: (children: DejaVueNode[]) => Element[]
  tweenTarget?: MaybeRefOrGetter<gsap.TweenTarget | undefined>
}

const AnimationScopePropTypes = {
  animation: Object as PropType<DejaVueAnimationScopeProps['animation']>,
  direction: Number as PropType<DejaVueAnimationScopeProps['direction']>,
  parent: Object as PropType<DejaVueAnimationScopeProps['parent']>,
  progress: Number as PropType<DejaVueAnimationScopeProps['progress']>
}

export function resolveChildrenTweenTarget (children: DejaVueNode[]) {
  return (
    children
      .map(child => (
        (child && 'seamless' in child && child.seamless)
          ? child.tweenTarget
          : getNodeElement(child)
      ))
      .flat()
      .filter(Boolean)
  ) as Element[]
}

export function useAnimationScope (options?: AnimationScopeOptions) {
  const attrs = useAttrs() as WrappableComponent
  const { children, root, Unwrap: AnimationScope } = useUnwrap<DejaVueNode, DejaVueAnimationScopeProps>(AnimationScopePropTypes)
  const tweenTarget = computed(() => {
    const target = toValue(options?.tweenTarget)
    if (!attrs.is || !target || target === 'children') {
      const resolveTweenTarget = options?.resolveChildrenTweenTarget || resolveChildrenTweenTarget
      return toNonEmptyArray<Element>(resolveTweenTarget(children))
    }
    if (typeof target !== 'string') return target
    if (attrs.is && target === 'self') return root.value
    return toNonEmptyArray<Element>(gsap.utils.toArray<Element>(target, root.value)) // try scoped DOM query selection
  })

  watch(tweenTarget, (_, previousTarget) => {
    if (!previousTarget) return
    gsap.killTweensOf(previousTarget)
    gsap.set(previousTarget, { clearProps: true })
  })

  return {
    AnimationScope,
    root,
    tweenTarget
  }
}
