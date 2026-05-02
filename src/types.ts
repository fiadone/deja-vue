import type { Animation } from './utils/Animation'

export interface ControllableAnimation {
  progress?: number
  toggle?: boolean | undefined
}

export interface NestableAnimation {
  parent?: Animation | null
  position?: gsap.Position
}

export interface WrappableAnimation {
  group?: boolean
  tag?: string
}

export type BaseAnimation = ControllableAnimation & NestableAnimation & WrappableAnimation

export type TimelineAnimation = BaseAnimation & {
  duration?: number
  options?: gsap.TimelineVars
  tweens?: TweenAnimationDefinition[]
}

export type TweenAnimationDefinition = (
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: `effect:${string}`, vars?: object }
) & Pick<NestableAnimation, 'position'>

export type TweenAnimation = BaseAnimation & TweenAnimationDefinition
