type EventCallback = (...args: unknown[]) => void

export class EventBus <E extends string> {
  private bus: Map<E, Set<EventCallback>>

  constructor (events?: E[]) {
    this.bus = new Map()
    events?.forEach(event => this.bus.set(event, new Set()))
  }

  on (event: E | E[], callback: EventCallback) {
    if (!this.bus) return
    if (Array.isArray(event)) {
      event.forEach(e => this.on(e, callback))
    } else {
      if (!this.bus.has(event)) this.bus.set(event, new Set())
      this.bus.get(event)!.add(callback)
    }
  }

  once (event: E | E[], callback: EventCallback) {
    const fn = (...args: unknown[]) => {
      this.off(event, fn)
      callback(...args)
    }

    this.on(event, fn)
  }

  off (event: E | E[], callback: EventCallback) {
    if (!this.bus) return
    if (Array.isArray(event)) {
      event.forEach(e => this.off(e, callback))
    } else if (this.bus.has(event) && this.bus.get(event)!.has(callback)) {
      this.bus.get(event)!.delete(callback)
    }
  }

  dispatch (event: E, ...args: unknown[]) {
    if (!this.bus?.has(event)) return
    this.bus.get(event)!.forEach(callback => callback(...args))
  }

  dispose () {
    this.bus?.clear()
    this.bus = null as unknown as Map<E, Set<EventCallback>>
  }
}
