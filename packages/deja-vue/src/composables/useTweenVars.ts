import { computed } from 'vue'

import type { TweenDefinition } from '../types'
import { useStableObjectProp } from './useStableObjectProp'

export function useTweenVars (definition: TweenDefinition) {
  const to = useStableObjectProp(() => definition.to)
  const from = useStableObjectProp(() => definition.from)
  const effectOptions = useStableObjectProp(() => definition.effectOptions)

  const method = computed(() => {
    if (definition.effect) return definition.effect
    if (definition.from && definition.to) return 'fromTo'
    return definition.from ? 'from' : 'to'
  })

  const vars = computed<gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]>(() => {
    switch (method.value) {
      case 'fromTo':
        return [from, to]
      case 'from':
        return from
      case 'to':
        return to
      default:
        return effectOptions
    }
  })

  return {
    method,
    vars
  }
}
