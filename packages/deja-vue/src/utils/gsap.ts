export function applyTimelineTotalDuration (timeline: gsap.core.Timeline) {
  const totalDuration = 'totalDuration' in (timeline.data || {})
    ? timeline.data.totalDuration as number
    : undefined
  if (totalDuration) timeline.duration(totalDuration)
}

export function resolveTimelinePosition (
  timeline: gsap.core.Timeline,
  position?: gsap.Position
): number | null {
  if (!timeline) return null
  if (position === undefined) return timeline.duration()
  if (typeof position === 'number') return position
  if (typeof position === 'string' && position in timeline.labels) return timeline.labels[position]
  timeline.add(timelinePositionProbe, position)
  const time = timeline.getTweensOf(timelinePositionProbe)[0]?.startTime()
  timeline.remove(timelinePositionProbe)
  return time ?? null
}

export function stripScrollTriggerVars (vars: gsap.AnimationVars, defaultTrigger?: gsap.DOMTarget): ScrollTrigger.Vars | null {
  if (!vars?.scrollTrigger) return null

  const scrollTriggerVars = (typeof vars.scrollTrigger === 'string' || typeof vars.scrollTrigger === 'number' || 'nodeType' in vars.scrollTrigger)
    ? { trigger: vars.scrollTrigger }
    : vars.scrollTrigger as ScrollTrigger.Vars

  delete vars.scrollTrigger

  if (!scrollTriggerVars.trigger && defaultTrigger) scrollTriggerVars.trigger = defaultTrigger

  return scrollTriggerVars
}

function timelinePositionProbe () {
  void 0
}
