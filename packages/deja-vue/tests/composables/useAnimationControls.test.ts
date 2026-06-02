import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useAnimationControls } from '../../src/composables/useAnimationControls'
import { Animation } from '../../src/core/Animation'
import { controls, modelRef, runComposable } from '../shared/helpers'

describe('useAnimationControls', () => {
  describe('controlled state', () => {
    it('is uncontrolled when neither progress nor trigger is set', () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1 })

      const { result } = runComposable(() => useAnimationControls(animation, controls({
        progress: modelRef<number | undefined>(undefined)
      })))

      expect(result.controlled).toBe(false)
      expect(animation.timeline.paused()).toBe(false)
    })

    it('pauses, syncs progress, and tracks direction in progress mode', async () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1, ease: 'none' })
      const progress = modelRef<number | undefined>(0)

      const { result } = runComposable(() => useAnimationControls(animation, controls({ progress })))

      expect(result.controlled).toBe(true)
      expect(animation.timeline.paused()).toBe(true)

      progress.value = 0.5
      await nextTick()
      expect(result.direction.value).toBe(1)
      expect(animation.timeline.progress()).toBe(0.5)

      progress.value = 0.2
      await nextTick()
      expect(result.direction.value).toBe(-1)

      animation.timeline.time(0.8)
      animation.dispatch('update', animation)
      await nextTick()
      expect(progress.value).toBeCloseTo(0.8, 5)
      expect(result.direction.value).toBe(1)
    })

    it('pauses and defaults progress to 0 in trigger-only mode', () => {
      const animation = new Animation()
      const progress = modelRef<number | undefined>(undefined)

      const { result } = runComposable(() => useAnimationControls(animation, controls({
        progress,
        trigger: ref('go')
      })))

      expect(result.controlled).toBe(true)
      expect(animation.timeline.paused()).toBe(true)
      expect(progress.value).toBe(0)
    })
  })

  describe('progress watch', () => {
    it('skips seeking when progress is cleared to undefined', async () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1, ease: 'none' })
      const progress = modelRef<number | undefined>(0.25)

      runComposable(() => useAnimationControls(animation, controls({ progress })))
      await nextTick()

      const seek = vi.spyOn(animation.timeline, 'progress')
      progress.value = undefined
      await nextTick()

      expect(seek).not.toHaveBeenCalled()
    })

    it('does not seek when progress matches the timeline', async () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1, ease: 'none' })
      const progress = modelRef<number | undefined>(0.4)

      runComposable(() => useAnimationControls(animation, controls({ progress })))
      await nextTick()
      animation.timeline.progress(0.4)
      await nextTick()

      const seek = vi.spyOn(animation.timeline, 'progress')
      progress.value = 0.4
      await nextTick()

      expect(seek).not.toHaveBeenCalled()
    })
  })

  describe('trigger watch', () => {
    it('runs only after the trigger value changes', async () => {
      const animation = new Animation()
      const run = vi.spyOn(animation, 'run')
      const trigger = ref(0)

      runComposable(() => useAnimationControls(animation, controls({ trigger })))
      expect(run).not.toHaveBeenCalled()

      trigger.value = 1
      await nextTick()

      expect(run).toHaveBeenCalledWith('play')
    })

    it('defaults the action to play', async () => {
      const animation = new Animation()
      const run = vi.spyOn(animation, 'run')
      const trigger = ref(0)

      runComposable(() => useAnimationControls(animation, controls({
        trigger,
        triggerOptions: { immediate: true }
      })))

      trigger.value = 1
      await nextTick()

      expect(run).toHaveBeenCalledWith('play')
    })

    it('runs a custom action with actionArgs', async () => {
      const animation = new Animation()
      const run = vi.spyOn(animation, 'run')
      const trigger = ref(false)

      runComposable(() => useAnimationControls(animation, controls({
        trigger,
        triggerAction: 'play',
        triggerOptions: { actionArgs: ['intro'], immediate: true }
      })))

      trigger.value = true
      await nextTick()

      expect(run).toHaveBeenCalledWith('play', 'intro')
    })

    it('supports custom triggerAction values', async () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1 })
      const run = vi.spyOn(animation, 'run')
      const trigger = ref(false)

      runComposable(() => useAnimationControls(animation, controls({
        trigger,
        triggerAction: 'pause',
        triggerOptions: { immediate: true }
      })))

      trigger.value = true
      await nextTick()

      expect(run).toHaveBeenCalledWith('pause')
    })
  })

  it('cleans up listeners and trigger scope on unmount', () => {
    const animation = new Animation()
    const off = vi.spyOn(animation, 'off')

    const { unmount } = runComposable(() => useAnimationControls(animation, controls()))
    unmount()

    expect(off).toHaveBeenCalledWith('update', expect.any(Function))
  })
})
