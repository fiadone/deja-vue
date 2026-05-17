import { gsap } from 'gsap'

import { ANIMATION_EVENTS } from '../constants'
import type { AnimationChild, AnimationEvent, TweenAction, TweenDefinition } from '../types'
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

  add (child: AnimationChild, position?: gsap.Position, timeShift?: boolean) {
    if (!this.timeline) return
    if (typeof child === 'string') {
      this.timeline.addLabel(child, position)
    } else if (typeof child === 'function') {
      this.timeline.add(child, position)
    } else if (this.timeline.isActive()) {
      this.once(['complete', 'reverseComplete'], () => this.add(child, position, timeShift))
    } else {
      if (timeShift && (typeof position === 'number' || (typeof position === 'string' && position in this.timeline.labels))) {
        const startTime = typeof position === 'number' ? position : this.timeline.labels[position]
        const duration = child.timeline.duration()
        this.timeline.getChildren(false, true, true).forEach(child => (child.startTime() > startTime && child.startTime(child.startTime() + duration)))
        this.timeline.add(child.timeline, position)
        this.timeline.invalidate()
      } else {
        this.timeline.add(child.timeline, position)
      }
      // preserve parent's total duration (if defined)
      const totalDuration = 'totalDuration' in (this.timeline.data || {}) ? this.timeline.data.totalDuration : undefined
      if (totalDuration) this.timeline.duration(totalDuration)
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
        this.timeline.remove(child.timeline)
        this.timeline.getChildren(false, true, true).forEach(child => (child.startTime() > startTime && child.startTime(child.startTime() - duration)))
        this.timeline.invalidate()
    }
  }

  compose (target: gsap.TweenTarget, definition: TweenDefinition | TweenDefinition[], withContext = true) {
    if (!this.timeline || !target || (Array.isArray(target) && !target.length)) return

    if (withContext) {
      this.ctx = gsap.context(() => this.compose(target, definition, false))
      return
    }

    if (Array.isArray(definition)) {
      definition.forEach(tween => this.compose(target, tween, false))
    } else if (definition.method.startsWith('effect')) {
      try {
        const [_, effect] = definition.method.split(':')
        this.timeline[effect](target, definition.vars)
      } catch {
        console.warn('[deja-vue] Missing or unknown gsap effect.')
      }
    } else if (definition.method === 'fromTo') {
      this.timeline.fromTo(target, ...definition.vars)
    } else {
      this.timeline[definition.method](target, definition.vars)
    }
  }

  run (action: TweenAction = 'play') {
    this.timeline?.[action]?.()
  }

  clear (revert?: boolean) {
    if (revert) this.ctx?.revert()
    this.timeline?.clear(true)
  }

  dispose() {
    super.dispose()
    this.ctx?.revert()
    this.timeline?.kill()
    this.ctx = null as unknown as gsap.Context
    this.timeline = null as unknown as gsap.core.Timeline
  }
}
