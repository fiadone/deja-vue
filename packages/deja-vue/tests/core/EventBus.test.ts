import { describe, expect, it, vi } from 'vitest'

import { EventBus } from '../../src/core/EventBus'

describe('EventBus', () => {
  it('dispatches payload to listeners', () => {
    const bus = new EventBus<'a' | 'b', [number]>()
    const onA = vi.fn()
    const onB = vi.fn()

    bus.on('a', onA)
    bus.on('b', onB)
    bus.dispatch('a', 1)

    expect(onA).toHaveBeenCalledWith(1)
    expect(onB).not.toHaveBeenCalled()
  })

  it('registers one listener for multiple events', () => {
    const bus = new EventBus<'a' | 'b', [number]>()
    const fn = vi.fn()

    bus.on(['a', 'b'], fn)
    bus.dispatch('a', 1)
    bus.dispatch('b', 2)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('once runs a single time', () => {
    const bus = new EventBus<'tick', [number]>()
    const fn = vi.fn()

    bus.once('tick', fn)
    bus.dispatch('tick', 1)
    bus.dispatch('tick', 2)

    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith(1)
  })

  it('off unsubscribes a listener', () => {
    const bus = new EventBus<'tick', [number]>()
    const fn = vi.fn()

    bus.on('tick', fn)
    bus.off('tick', fn)
    bus.dispatch('tick', 1)

    expect(fn).not.toHaveBeenCalled()
  })

  it('off removes a listener from multiple events', () => {
    const bus = new EventBus<'a' | 'b', [number]>()
    const fn = vi.fn()

    bus.on('a', fn)
    bus.on('b', fn)
    bus.off(['a', 'b'], fn)
    bus.dispatch('a', 1)
    bus.dispatch('b', 2)

    expect(fn).not.toHaveBeenCalled()
  })

  it('off ignores callbacks that were never registered', () => {
    const bus = new EventBus<'tick', [number]>()
    const fn = vi.fn()

    bus.on('tick', fn)
    bus.off('tick', vi.fn())
    bus.dispatch('tick', 1)

    expect(fn).toHaveBeenCalledWith(1)
  })

  it('dispatch is a no-op without listeners', () => {
    const bus = new EventBus<'tick', [number]>()
    expect(() => bus.dispatch('tick', 1)).not.toThrow()
  })

  it('dispose clears listeners', () => {
    const bus = new EventBus<'tick', [number]>()
    const fn = vi.fn()

    bus.on('tick', fn)
    bus.dispose()
    bus.dispatch('tick', 1)

    expect(fn).not.toHaveBeenCalled()
  })

  it('on, off, and dispatch are no-ops after dispose', () => {
    const bus = new EventBus<'tick', [number]>()
    const fn = vi.fn()

    bus.on('tick', fn)
    bus.dispose()
    bus.on('tick', fn)
    bus.off('tick', fn)
    bus.dispatch('tick', 1)

    expect(fn).not.toHaveBeenCalled()
  })
})
