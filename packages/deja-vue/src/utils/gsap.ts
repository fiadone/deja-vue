export function applyTimelineTotalDuration (timeline: gsap.core.Timeline) {
  const totalDuration = 'totalDuration' in (timeline.data || {})
    ? timeline.data.totalDuration as number
    : undefined
  if (totalDuration) timeline.duration(totalDuration)
}

export function getScrollTriggerToggleActionByEvent (event: 'enter' | 'enterBack' | 'leave' | 'leaveBack', instance?: ScrollTrigger) {
  if (!instance?.vars.toggleActions) return
  const actions = instance.vars.toggleActions.split(' ')
  switch (event) {
    case 'enter': return actions[0]
    case 'enterBack': return actions[2]
    case 'leave': return actions[1]
    case 'leaveBack': return actions[3]
    default: return
  }
}

export function isEmptyTarget (target: gsap.DOMTarget) {
  return !target || (Array.isArray(target) && !target.length)
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
