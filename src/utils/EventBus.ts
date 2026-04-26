export class EventBus {
  private bus: Map<string, Set<CallableFunction>>

  constructor (events?: string[]) {
    this.bus = new Map()
    events?.forEach(event => this.bus.set(event, new Set()))
  }

  on (event: string, callback: CallableFunction) {
    if (!this.bus.has(event)) this.bus.set(event, new Set())
    this.bus.get(event)!.add(callback)
  }

  off (event: string, callback: CallableFunction) {
    if (!this.bus.has(event) || !this.bus.get(event)?.has(callback)) return
    this.bus.get(event)!.delete(callback)
  }

  dispatch (event: string, ...args: any[]) {
    if (!this.bus.has(event)) return
    this.bus.get(event)!.forEach(callback => callback(...args))
  }

  dispose () {
    this.bus.clear()
    // @ts-expect-error null is not assignable to Map<string, Set<CallableFunction>>
    this.bus = null
  }
}
