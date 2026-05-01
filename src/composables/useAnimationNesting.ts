import { inject, nextTick, onMounted, onUnmounted } from 'vue'

import { parentAnimationInjectionKey } from '../constants'
import type { NestableAnimation } from '../types'
import { Animation } from '../utils/Animation'

export function useAnimationNesting (child?: Animation | gsap.Callback | string, options?: NestableAnimation) {
  const parent = options?.parent === null ? null : options?.parent || inject(parentAnimationInjectionKey, null)

  onMounted(async () => {
    if (!parent || !child) return
    await nextTick()
    parent.add(child, options?.position)
  })

  onUnmounted(() => {
    if (!child) return
    if (parent) {
      parent.remove(child)
    } else if (child instanceof Animation) {
      child.dispose()
    }
  })

  return {
    parent
  }
}
