import type { MaybeRefOrGetter } from 'vue'
import { computed, shallowReactive, toValue, watch } from 'vue'

import { cloneObject, patchObject } from '../utils'

export function useStableTweenVars (vars: MaybeRefOrGetter<gsap.TweenVars | [gsap.TweenVars, gsap.TweenVars]>) {
  const computedVars = computed(() => toValue(vars))
  const stableVars = shallowReactive(cloneObject(computedVars.value))

  watch(computedVars, updatedVars => {
    if (Array.isArray(updatedVars) !== Array.isArray(stableVars)) {
      console.warn('[deja-vue] Tween vars shape changed at runtime. Switching between a single vars object and a vars tuple is not supported; keep the same vars shape or key the Tween by method to recreate it.')
      return
    }

    if (Array.isArray(updatedVars)) {
      const [from, to] = stableVars as [gsap.TweenVars, gsap.TweenVars]
      patchObject(from, updatedVars[0])
      patchObject(to, updatedVars[1])
    } else {
      patchObject(stableVars as gsap.TweenVars, updatedVars)
    }
  })

  return stableVars
}
