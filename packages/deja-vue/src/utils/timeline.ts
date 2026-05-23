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
  const probe: gsap.Callback = () => void
  timeline.add(probe, position)
  const time = timeline.getTweensOf(probe)[0]?.startTime()
  timeline.remove(probe)
  return time ?? null
}
