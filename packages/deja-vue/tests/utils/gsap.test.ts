import { gsap } from 'gsap'
import { describe, expect, it, vi } from 'vitest'

import {
  applyTimelineTotalDuration,
  resolveTimelinePosition,
  stripScrollTriggerVars
} from '../../src/utils/gsap'

describe('resolveTimelinePosition', () => {
  it('returns null without a timeline', () => {
    expect(resolveTimelinePosition(null as unknown as gsap.core.Timeline)).toBeNull()
  })

  it('resolves duration, labels, and numeric positions', () => {
    const timeline = gsap.timeline()
    timeline.to({}, { duration: 2 })
    timeline.addLabel('mid', 1)

    expect(resolveTimelinePosition(timeline)).toBe(timeline.duration())
    expect(resolveTimelinePosition(timeline, 'mid')).toBe(1)
    expect(resolveTimelinePosition(timeline, 0.5)).toBe(0.5)
  })

  it('probes non-label string positions', () => {
    const timeline = gsap.timeline()
    const startTime = vi.fn().mockReturnValue(1.25)
    let probe: gsap.Callback = () => {}

    vi.spyOn(timeline, 'add').mockImplementation(child => {
      if (typeof child === 'function') probe = child
      return timeline
    })
    vi.spyOn(timeline, 'getTweensOf').mockReturnValue([{ startTime }] as never)
    vi.spyOn(timeline, 'remove').mockImplementation(() => timeline)

    expect(resolveTimelinePosition(timeline, 'custom-position')).toBe(1.25)
    probe()
    expect(timeline.remove).toHaveBeenCalled()
  })

  it('returns null when the probe has no start time', () => {
    const timeline = gsap.timeline()

    vi.spyOn(timeline, 'add').mockImplementation(() => timeline)
    vi.spyOn(timeline, 'getTweensOf').mockReturnValue([])
    vi.spyOn(timeline, 'remove').mockImplementation(() => timeline)

    expect(resolveTimelinePosition(timeline, 'custom-position')).toBeNull()
  })
})

describe('applyTimelineTotalDuration', () => {
  it('applies totalDuration from timeline data', () => {
    const timeline = gsap.timeline()
    timeline.data = { totalDuration: 5 }
    const duration = vi.spyOn(timeline, 'duration')

    applyTimelineTotalDuration(timeline)

    expect(duration).toHaveBeenCalledWith(5)
  })

  it('skips when totalDuration is missing', () => {
    const timeline = gsap.timeline()
    const duration = vi.spyOn(timeline, 'duration')

    applyTimelineTotalDuration(timeline)

    expect(duration).not.toHaveBeenCalled()
  })
})

describe('stripScrollTriggerVars', () => {
  it('returns null without scrollTrigger', () => {
    expect(stripScrollTriggerVars({ x: 1 })).toBeNull()
  })

  it('normalizes string scrollTrigger values', () => {
    const target = document.createElement('div')
    const vars: gsap.TweenVars = { scrollTrigger: '#trigger', x: 1 }

    expect(stripScrollTriggerVars(vars, target)?.trigger).toBe('#trigger')
  })

  it('moves object scrollTrigger vars off the tween and fills the trigger', () => {
    const target = document.createElement('div')
    const vars: gsap.TweenVars = { scrollTrigger: { start: 'top' }, x: 1 }
    const config = stripScrollTriggerVars(vars, target)

    expect(vars.scrollTrigger).toBeUndefined()
    expect(config?.trigger).toBe(target)
    expect(config?.start).toBe('top')
  })
})
