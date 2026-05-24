import { gsap } from 'gsap'

import { ANIMATION_EVENTS } from '../constants'
import type { AnimationChild, AnimationComposeDefinition, AnimationEvent, TweenAction } from '../types'
import { applyTimelineTotalDuration, resolveTimelinePosition } from '../utils/timeline'
import { EventBus } from './EventBus'

export class Animation extends EventBus<AnimationEvent> {
  private ctx?: gsap.Context
  public timeline: gsap.core.Timeline

  constructor (options?: gsap.TimelineVars) {
    super(ANIMATION_EVENTS)

    this.timeline = gsap.timeline({
      ...options,
      onComplete: () => this.dispatch('complete'),
      onInterrupt: () => this.dispatch('interrupt'),
      onRepeat: () => this.dispatch('repeat'),
      onReverseComplete: () => this.dispatch('reverseComplete'),
      onStart: () => this.dispatch('start'),
      onUpdate: () => this.dispatch('update')
    })

    // delegating event callbacks from timeline options to the EventBus
    for (const [key, callback] of options ? Object.entries(options).filter(([key]) => key.startsWith('on')) : []) {
      const [firstChar, ...rest] = key.replace(/^on/, '')
      const event = `${firstChar.toLowerCase()}${rest.join('')}` as AnimationEvent
      this.on(event, callback)
    }
  }

  add (child: AnimationChild, position?: gsap.Position, timeShift = false) {
    if (!this.timeline) return
    if (typeof child === 'string') {
      this.timeline.addLabel(child, position)
    } else if (typeof child === 'function') {
      this.timeline.add(child, position)
    } else if (this.timeline.isActive()) {
      this.once(['complete', 'reverseComplete'], () => this.add(child, position, timeShift))
    } else {
      const targetTime = timeShift ? resolveTimelinePosition(this.timeline, position) : null
      if (targetTime !== null) {
        // Strictly after targetTime so co-located parallel siblings are not shifted.
        this.timeline.shiftChildren(child.timeline.duration(), false, targetTime + Number.EPSILON)
        this.timeline.add(child.timeline, targetTime)
      } else {
        this.timeline.add(child.timeline, position)
      }
      applyTimelineTotalDuration(this.timeline)
    }
  }

  remove (child: AnimationChild) {
    if (!this.timeline) return
    if (typeof child === 'string') {
      this.timeline.removeLabel(child)
    } else if (typeof child === 'function') {
      this.timeline.remove(child)
    } else if (this.timeline.isActive()) {
      this.once(['complete', 'reverseComplete'], () => this.remove(child))
    } else {
      const startTime = child.timeline.startTime()
      const duration = child.timeline.duration()
      const endTime = startTime + duration
      this.timeline.remove(child.timeline)
      this.timeline.shiftChildren(-duration, false, endTime)
      applyTimelineTotalDuration(this.timeline)
    }
  }

  compose (definition: AnimationComposeDefinition, withContext = true) {
    if (!this.timeline || !definition.target || (Array.isArray(definition.target) && !definition.target.length)) return

    if (withContext) {
      this.ctx = gsap.context(() => this.compose(definition, false))
      return
    }

    const target = definition.target

    if (definition.method === 'fromTo') {
      const [from, to] = definition.vars as [gsap.TweenVars, gsap.TweenVars]
      this.timeline.fromTo(target, from, to)
    } else if (definition.method in this.timeline) {
      const vars = definition.vars as gsap.TweenVars
      this.timeline[definition.method](target, vars)
    } else {
      console.warn('[deja-vue] Missing or unknown gsap effect.')
    }
  }

  run (action: TweenAction = 'play') {
    this.timeline?.[action]?.()
  }

  clear (revert?: boolean) {
    if (revert) this.ctx?.revert()
    this.timeline?.clear(true)
  }

  dispose () {
    super.dispose()
    this.ctx?.revert()
    this.timeline?.kill()
    this.ctx = null as unknown as gsap.Context
    this.timeline = null as unknown as gsap.core.Timeline
  }
}
