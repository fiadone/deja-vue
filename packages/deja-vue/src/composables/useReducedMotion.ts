import type { MaybeRefOrGetter } from 'vue'
import { computed, inject, ref, toValue, unref } from 'vue'

import { dejaVueParentInstance } from '../constants'

export type ReducedMotionMode = boolean | 'auto'

const systemReducedMotion = ref(false)

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  systemReducedMotion.value = mediaQuery.matches
  mediaQuery.addEventListener('change', e => (systemReducedMotion.value = e.matches))
}

export function useReducedMotion (mode?: MaybeRefOrGetter<ReducedMotionMode | undefined>) {
  const parent = inject(dejaVueParentInstance, null)
  const reducedMotionMode = computed(() => toValue(mode) ?? unref(parent?.reducedMotion) ?? 'auto')
  const reducedMotion = computed(() => (
    reducedMotionMode.value === 'auto'
      ? systemReducedMotion.value
      : reducedMotionMode.value
  ))

  return {
    computed: reducedMotion,
    system: systemReducedMotion
  }
}
