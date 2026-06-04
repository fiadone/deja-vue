import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { describe, expect, it, vi } from 'vitest'

import { ANIMATION_EVENTS } from '../../src/constants'
import { Animation } from '../../src/core/Animation'
import { nestedTimelines } from '../shared/helpers'

describe('Animation', () => {
  describe('events', () => {
    it.each(ANIMATION_EVENTS)('dispatches %s to listeners', event => {
      const animation = new Animation()
      const listener = vi.fn()

      animation.on(event, listener)
      animation.dispatch(event, animation)

      expect(listener).toHaveBeenCalledWith(animation)
    })

    it('forwards timeline option callbacks to the bus', () => {
      const onStart = vi.fn()
      const animation = new Animation({ onStart })

      animation.dispatch('start', animation)

      expect(onStart).toHaveBeenCalledWith(animation)
    })

    it('dispatches repeat, interrupt, and reverseComplete from the timeline', () => {
      const animation = new Animation({ repeat: 1 })
      const repeat = vi.fn()
      const interrupt = vi.fn()
      const reverseComplete = vi.fn()

      animation.on('repeat', repeat)
      animation.on('interrupt', interrupt)
      animation.on('reverseComplete', reverseComplete)

      animation.timeline.eventCallback('onInterrupt')?.()
      animation.timeline.eventCallback('onRepeat')?.()
      animation.timeline.eventCallback('onReverseComplete')?.()

      expect(interrupt).toHaveBeenCalledWith(animation)
      expect(repeat).toHaveBeenCalledWith(animation)
      expect(reverseComplete).toHaveBeenCalledWith(animation)
    })
  })

  describe('run', () => {
    it('run("play") starts playback', () => {
      const animation = new Animation()
      const play = vi.spyOn(animation.timeline, 'play')

      animation.run('play')

      expect(play).toHaveBeenCalled()
    })

    it('run("reset") pauses at the given time', () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 2 })
      animation.run('play')
      animation.run('reset', 0.25)

      expect(animation.timeline.paused()).toBe(true)
      expect(animation.timeline.time()).toBe(0.25)
    })
  })

  describe('clear', () => {
    it('removes timeline children', () => {
      const animation = new Animation()
      animation.timeline.to({}, { duration: 1 })
      animation.clear()
      expect(animation.timeline.getChildren()).toHaveLength(0)
    })

    it('clear(revert) reverts the gsap context', () => {
      const animation = new Animation()
      const revert = vi.fn()
      vi.spyOn(gsap, 'context').mockImplementation(fn => {
        if (typeof fn === 'function') (fn as () => void)()
        return { revert } as unknown as gsap.Context
      })

      animation.compose({ method: 'to', target: document.createElement('div'), vars: { x: 1 } })
      animation.clear(true)

      expect(revert).toHaveBeenCalled()
      vi.mocked(gsap.context).mockRestore()
    })
  })

  describe('dispose', () => {
    it('kills the timeline', () => {
      const animation = new Animation()
      animation.dispose()
      expect(animation.timeline).toBeNull()
    })

    it('no-ops add, remove, compose, and run after dispose', () => {
      const animation = new Animation()
      const child = new Animation()
      animation.dispose()

      expect(() => {
        animation.add(child)
        animation.remove(child)
        animation.compose({ method: 'to', target: document.createElement('div'), vars: {} }, false)
        animation.run('play')
      }).not.toThrow()
    })
  })

  describe('add', () => {
    it('adds and removes callbacks when paused', () => {
      const parent = new Animation()
      const callback = vi.fn()

      parent.add(callback, 0)
      expect(parent.timeline.getChildren()).toHaveLength(1)
      parent.remove(callback)
      expect(parent.timeline.getChildren()).toHaveLength(0)
    })

    it('adds labels, callbacks, and nested animations when paused', () => {
      const parent = new Animation()
      const child = new Animation()
      const callback = vi.fn()

      parent.add('mark', 0)
      parent.add(callback, 0.5)
      parent.add(child)

      expect(parent.timeline.labels).toHaveProperty('mark')
      expect(parent.timeline.getChildren()).toHaveLength(2)
      expect(nestedTimelines(parent)).toContain(child.timeline)
    })

    it('defers while playing and runs after playback ends', () => {
      const parent = new Animation()
      const child = new Animation()
      const isActive = vi.spyOn(parent.timeline, 'isActive').mockReturnValue(true)

      parent.add(child)
      expect(nestedTimelines(parent)).toHaveLength(0)

      isActive.mockReturnValue(false)
      parent.dispatch('complete', parent)
      expect(nestedTimelines(parent)).toHaveLength(1)
    })

    it('shifts siblings with timeShift', () => {
      const parent = new Animation()
      const first = new Animation()
      const second = new Animation()
      const shift = vi.spyOn(parent.timeline, 'shiftChildren')

      first.timeline.to({}, { duration: 2 })
      second.timeline.to({}, { duration: 1 })
      parent.add(first, 0)
      parent.add(second, 0, true)

      expect(shift).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('no-ops for an already disposed child', () => {
      const parent = new Animation()
      const child = new Animation()

      parent.add(child)
      child.dispose()

      expect(() => parent.remove(child)).not.toThrow()
    })

    it('force-removes a nested animation from the parent timeline', () => {
      const parent = new Animation()
      const first = new Animation()
      const second = new Animation()

      parent.add(first)
      parent.add(second)
      expect(nestedTimelines(parent)).toHaveLength(2)

      parent.remove(second, true)

      expect(nestedTimelines(parent)).toHaveLength(1)
      expect(nestedTimelines(parent)).not.toContain(second.timeline)
    })

    it('removes labels and nested animations when paused', () => {
      const parent = new Animation()
      const child = new Animation()

      parent.add('mark', 0)
      parent.add(child)
      parent.remove('mark')
      parent.remove(child)

      expect(parent.timeline.labels).not.toHaveProperty('mark')
      expect(nestedTimelines(parent)).toHaveLength(0)
    })

    it('shifts trailing siblings when removing a nested animation', () => {
      const parent = new Animation()
      const child = new Animation()
      const shift = vi.spyOn(parent.timeline, 'shiftChildren')

      child.timeline.to({}, { duration: 1 })
      parent.add(child, 0)
      parent.remove(child)

      expect(shift).toHaveBeenCalledWith(-1, false, expect.any(Number))
    })

    it('defers while playing, force-removes, or runs after playback ends', () => {
      const parent = new Animation()
      const child = new Animation()

      parent.add(child)
      const isActive = vi.spyOn(parent.timeline, 'isActive').mockReturnValue(true)

      parent.remove(child)
      expect(nestedTimelines(parent)).toHaveLength(1)

      parent.remove(child, true)
      expect(nestedTimelines(parent)).toHaveLength(0)

      parent.add(child)
      parent.remove(child)
      isActive.mockReturnValue(false)
      parent.dispatch('complete', parent)
      expect(nestedTimelines(parent)).toHaveLength(0)
    })
  })

  describe('compose', () => {
    it('adds tweens for supported methods', () => {
      const animation = new Animation()
      const target = document.createElement('div')

      animation.compose({ method: 'to', target, vars: { x: 100 } }, false)
      animation.compose({ method: 'fromTo', target, vars: [{ opacity: 0 }, { opacity: 1 }] }, false)

      expect(animation.timeline.getChildren().length).toBeGreaterThan(0)
    })

    it('skips empty targets', () => {
      const animation = new Animation()
      animation.compose({ method: 'to', target: [], vars: { x: 1 } }, false)
      expect(animation.timeline.getChildren()).toHaveLength(0)
    })

    it('uses gsap.context when withContext is true', () => {
      const animation = new Animation()
      const revert = vi.fn()
      const context = vi.spyOn(gsap, 'context').mockImplementation(fn => {
        if (typeof fn === 'function') (fn as () => void)()
        return { revert } as unknown as gsap.Context
      })

      animation.compose({ method: 'to', target: document.createElement('div'), vars: { x: 1 } })
      expect(context).toHaveBeenCalled()
      animation.dispose()
      expect(revert).toHaveBeenCalled()
      context.mockRestore()
    })

    it('warns for unknown compose methods', () => {
      const animation = new Animation()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      animation.compose({ method: 'nope' as 'to', target: document.createElement('div'), vars: {} }, false)

      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('attachScrollTrigger from compose when tween vars include scrollTrigger', () => {
      const animation = new Animation()
      const create = vi.spyOn(ScrollTrigger, 'create').mockReturnValue({ kill: vi.fn() } as unknown as ScrollTrigger)

      animation.compose({
        method: 'to',
        target: document.createElement('div'),
        vars: { scrollTrigger: { start: 'top' }, x: 1 }
      }, false)

      expect(create).toHaveBeenCalled()
      create.mockRestore()
    })
  })

  describe('getChildPosition', () => {
    it('resolves labels and marker callbacks', () => {
      const parent = new Animation()
      const callback = vi.fn()

      parent.add('mark', 0.25)
      parent.add(callback, 0.5)

      expect(parent.getChildPosition('mark')).toBe(0.25)
      expect(parent.getChildPosition(callback)).toBe(0.5)
    })

    it('returns undefined without a timeline or for unknown labels', () => {
      const parent = new Animation()
      const callback = vi.fn()

      expect(parent.getChildPosition('missing')).toBeUndefined()
      expect(parent.getChildPosition(callback)).toBeUndefined()

      parent.dispose()
      expect(parent.getChildPosition('mark')).toBeUndefined()
    })

    it('resolves nested animation start time from the parent timeline', () => {
      const parent = new Animation()
      const child = new Animation()
      const startTime = vi.fn().mockReturnValue(1.25)

      vi.spyOn(parent.timeline, 'getTweensOf').mockImplementation(target => (
        target === child.timeline ? [{ startTime }] as never : parent.timeline.getTweensOf(target)
      ))

      expect(parent.getChildPosition(child)).toBe(1.25)
    })
  })

  describe('attachScrollTrigger', () => {
    it('replaces the previous instance', () => {
      const animation = new Animation()
      const previous = { kill: vi.fn() }
      const create = vi.spyOn(ScrollTrigger, 'create').mockReturnValue(previous as unknown as ScrollTrigger)

      animation.attachScrollTrigger({ start: 'top' })
      animation.attachScrollTrigger(null)

      expect(previous.kill).toHaveBeenCalled()
      create.mockRestore()
    })

    it('dispatches update when a toggleActions reset edge fires', () => {
      const animation = new Animation()
      const listener = vi.fn()
      let vars: ScrollTrigger.Vars = {}
      const delayedCall = vi.spyOn(gsap, 'delayedCall').mockImplementation((_delay, callback) => {
        callback()
        return { kill: vi.fn() } as unknown as gsap.core.Tween
      })

      animation.on('update', listener)
      vi.spyOn(ScrollTrigger, 'create').mockImplementation(config => {
        vars = config
        return { kill: vi.fn(), vars: config } as unknown as ScrollTrigger
      })

      animation.attachScrollTrigger({ start: 'top', toggleActions: 'play none none reset' })
      vars.onLeaveBack?.({} as ScrollTrigger)

      expect(delayedCall).toHaveBeenCalledWith(0, expect.any(Function))
      expect(listener).toHaveBeenCalledWith(animation)

      delayedCall.mockRestore()
      vi.mocked(ScrollTrigger.create).mockRestore()
    })

    it('forwards scroll edge callbacks and resets on enter, enterBack, and leave', () => {
      const animation = new Animation()
      let vars: ScrollTrigger.Vars = {}
      const onEnter = vi.fn()
      const onEnterBack = vi.fn()
      const onLeave = vi.fn()

      vi.spyOn(ScrollTrigger, 'create').mockImplementation(config => {
        vars = config
        return { kill: vi.fn(), vars: config } as unknown as ScrollTrigger
      })

      animation.attachScrollTrigger({
        onEnter,
        onEnterBack,
        onLeave,
        start: 'top'
      })

      const self = {} as ScrollTrigger
      vars.onEnter?.(self)
      vars.onEnterBack?.(self)
      vars.onLeave?.(self)

      expect(onEnter).toHaveBeenCalledWith(self)
      expect(onEnterBack).toHaveBeenCalledWith(self)
      expect(onLeave).toHaveBeenCalledWith(self)

      vi.mocked(ScrollTrigger.create).mockRestore()
    })
  })
})
