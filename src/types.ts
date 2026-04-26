import type { EventBus } from './utils/EventBus'

export interface ControllableAnimation {
  progress?: number
  toggle?: boolean | undefined
}

export interface NestableAnimation {
  parent?: AnimationInstance | null
  position?: gsap.Position
}

export interface WrappableAnimation {
  group?: boolean
  initiallyHidden?: boolean
  tag?: string
}

export type BaseAnimation = ControllableAnimation & NestableAnimation & WrappableAnimation

export type TimelineAnimation = BaseAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  tweens?: (TweenAnimationDefinition & { position?: gsap.Position })[]
}

export type TweenAnimationDefinition = (
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: `effect:${string}`, vars?: object }
)

export type TweenAnimation = BaseAnimation & TweenAnimationDefinition

export interface AnimationInstance {
  eventBus: EventBus
  timeline: gsap.core.Timeline
}