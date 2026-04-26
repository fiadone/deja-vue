import { inject, onMounted, onUnmounted } from 'vue'

import { parentAnimationInjectionKey } from '../constants'
import type { AnimationInstance, NestableAnimation } from '../types'

export function useAnimationNesting (child: AnimationInstance | gsap.Callback | string, options?: NestableAnimation) {
  const parent = options?.parent === null ? null : options?.parent || inject(parentAnimationInjectionKey, null)
  const callback = typeof child === 'function' ? () => child(parent) : undefined

  onMounted(() => {
    if (!parent) return
    if (typeof child === 'string') {
      parent.timeline.addLabel(child, options?.position)
    } else if (typeof child === 'function') {
      parent.timeline.add(callback!, options?.position)
    } else {
      parent.timeline.add(child.timeline, options?.position)
      // preserve parent's total duration (if defined)
      const totalDuration = 'totalDuration' in (parent.timeline.data || {}) ? parent.timeline.data.totalDuration : undefined
      if (totalDuration) parent.timeline.duration(totalDuration)
    }
  })

  onUnmounted(() => {
    if (parent) {
      if (typeof child === 'string') {
        parent.timeline.removeLabel(child)
      } else if (typeof child === 'function') {
        parent.timeline.remove(callback!)
      } else {
        parent.eventBus.on('complete', () => {
          const startTime = child.timeline.startTime()
          const duration = child.timeline.duration()
          parent.timeline.remove(child.timeline)
          parent.timeline.getChildren(false, true, true).forEach(child => (child.startTime() > startTime && child.startTime(child.startTime() - duration)))
          parent.timeline.invalidate()
        })
      }
    } else if (typeof child === 'object') {
      child.timeline.kill()
    }
  })

  return {
    parent
  }
}
