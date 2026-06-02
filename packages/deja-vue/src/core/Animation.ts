import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ANIMATION_EVENTS } from '../constants'
import type { AnimationChild, AnimationComposeDefinition, AnimationEvent, TweenAction } from '../types'
import { applyTimelineTotalDuration, resolveTimelinePosition, stripScrollTriggerVars } from '../utils/gsap'
import { EventBus } from './EventBus'

gsap.registerPlugin(ScrollTrigger)

export class Animation extends EventBus<AnimationEvent, [animation: Animation]> {
  private ctx?: gsap.Context
  private scrollTrigger?: ScrollTrigger
  public timeline: gsap.core.Timeline

  constructor (options?: gsap.TimelineVars) {
    super(ANIMATION_EVENTS)

    this.timeline = gsap.timeline({
      ...options,
      onComplete: () => this.dispatch('complete', this),
      onInterrupt: () => this.dispatch('interrupt', this),
      onRepeat: () => this.dispatch('repeat', this),
      onReverseComplete: () => this.dispatch('reverseComplete', this),
      onStart: () => this.dispatch('start', this),
      onUpdate: () => this.dispatch('update', this)
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

  remove (child: AnimationChild, force?: boolean) {
    if (!this.timeline) return
    if (typeof child === 'string') {
      this.timeline.removeLabel(child)
    } else if (typeof child === 'function') {
      this.timeline.remove(child)
    } else if (!child.timeline) {
      return // already disposed
    } else if (this.timeline.isActive() && !force) {
      this.once(['complete', 'reverseComplete'], () => this.remove(child, force))
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
    let scrollTriggerVars: ScrollTrigger.Vars | null = null

    if (definition.method === 'fromTo') {
      const [from, to] = definition.vars as [gsap.TweenVars, gsap.TweenVars]
      scrollTriggerVars = stripScrollTriggerVars(to, target)
      this.timeline.fromTo(target, from, to)
    } else if (definition.method in this.timeline) {
      const vars = definition.vars as gsap.TweenVars
      scrollTriggerVars = stripScrollTriggerVars(vars, target)
      this.timeline[definition.method](target, vars)
    } else {
      console.warn('[deja-vue] Missing or unknown gsap effect.')
    }

    this.attachScrollTrigger(scrollTriggerVars)
  }

  attachScrollTrigger (vars: ScrollTrigger.Vars | null | undefined) {
    this.scrollTrigger?.kill()
    if (!vars) return
    this.scrollTrigger = ScrollTrigger.create({ ...vars, animation: this.timeline })
  }

  run (action: TweenAction = 'play', ...args: any[]) {
    if (action === 'reset') {
      const [atTime = 0, ...rest] = args
      this.timeline?.pause(atTime, ...rest)
    } else {
      this.timeline?.[action]?.(...args)
    }
  }

  clear (revert?: boolean) {
    if (revert) this.ctx?.revert()
    this.timeline?.clear(true)
  }

  dispose () {
    super.dispose()
    this.ctx?.revert()
    this.scrollTrigger?.kill()
    this.timeline?.kill()
    this.ctx = null as unknown as gsap.Context
    this.scrollTrigger = null as unknown as ScrollTrigger
    this.timeline = null as unknown as gsap.core.Timeline
  }
}
