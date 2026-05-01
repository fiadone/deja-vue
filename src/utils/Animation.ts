import { gsap } from 'gsap'
import { ANIMATION_EVENTS } from '../constants'
import type { TweenAnimationDefinition } from '../types'
import { EventBus } from './EventBus'

export class Animation extends EventBus<typeof ANIMATION_EVENTS[number]> {
  public timeline: gsap.core.Timeline

  constructor (options?: gsap.TimelineVars) {
    super([...ANIMATION_EVENTS])

    this.timeline = gsap.timeline({
      ...options,
      onComplete: () => this.dispatch('complete'),
      onRepeat: () => this.dispatch('repeat'),
      onReverseComplete: () => this.dispatch('reverseComplete'),
      onStart: () => this.dispatch('start'),
      onUpdate: () => this.dispatch('update')
    })

    // delegating event callbacks from timeline options to the EventBus
    const eventCallbacks = options ? Object.entries(options).filter(([key]) => key.startsWith('on')) : []
    eventCallbacks.forEach(([key, fn]) => {
      const [firstChar, ...rest] = key.replace(/^on/, '')
      const event = `${firstChar.toLowerCase()}${rest.join()}` as typeof ANIMATION_EVENTS[number]
      this.on(event, fn)
    })
  }

  add (child: Animation | gsap.Callback | string, position?: gsap.Position) {
    if (typeof child === 'string') {
      this.timeline.addLabel(child, position)
    } else if (typeof child === 'function') {
      this.timeline.add(child, position)
    } else {
      this.timeline.add(child.timeline, position)
      // preserve parent's total duration (if defined)
      const totalDuration = 'totalDuration' in (this.timeline.data || {}) ? this.timeline.data.totalDuration : undefined
      if (totalDuration) this.timeline.duration(totalDuration)
    }
  }

  remove (child: Animation | gsap.Callback | string) {
    if (typeof child === 'string') {
      this.timeline.removeLabel(child)
    } else if (typeof child === 'function') {
      this.timeline.remove(child)
    } else {
      this.once(['complete', 'reverseComplete'], () => {
        const startTime = child.timeline.startTime()
        const duration = child.timeline.duration()
        this.timeline.remove(child.timeline)
        this.timeline.getChildren(false, true, true).forEach(child => (child.startTime() > startTime && child.startTime(child.startTime() - duration)))
        this.timeline.invalidate()
      })
    }
  }

  compose (target: HTMLElement | HTMLCollection, definition: TweenAnimationDefinition | TweenAnimationDefinition[]) {
    if (Array.isArray(definition)) {
      definition.forEach(tween => this.compose(target, tween))
    } else if (definition.method.startsWith('effect')) {
      try {
        const [_, effect] = definition.method.split(':')
        this.timeline[effect](target, structuredClone(definition.vars))
      } catch {
        console.warn('Missing or unknown effect')
      }
    } else if (definition.method === 'fromTo') {
      this.timeline.fromTo(target, ...structuredClone(definition.vars))
    } else {
      this.timeline[definition.method](target, structuredClone(definition.vars))
    }
  }

  dispose() {
    super.dispose()
    this.timeline.kill()
    // @ts-expect-error null is not assignable to gsap.core.Timeline
    this.timeline = null
  }
}
