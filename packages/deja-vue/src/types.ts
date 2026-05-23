import type { Component, ComputedRef, ModelRef, Ref, ShallowRef, UnwrapRef, WatchOptions } from 'vue'
import type { NodeRef } from 'vue-unwrap'

import type { Animation } from './core/Animation'

export type NonEmptyArray<T> = [T, ...T[]]
export type PlainObject<T> = [T] extends [readonly unknown[]] ? never : T

export type DejaVueNode = DejaVueComponent | NodeRef

export interface DejaVueComponent {
  $el: ShallowRef<Element | null>
  seamless?: boolean | ComputedRef<boolean>
  target: ComputedRef<gsap.TweenTarget>
}

export interface DejaVueInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection>
  parent: DejaVueInstance | null
  progress: ModelRef<ControllableAnimation['progress']>
}

export type DejaVueInstanceExposed = {
  [K in keyof Omit<DejaVueInstance, 'parent' | 'trigger'>]: UnwrapRef<DejaVueInstance[K]>
} & {
  parent: DejaVueInstance | null
}

export type AnimationChild = Animation | gsap.Callback | string

export type AnimationComposeDefinition = { target: gsap.TweenTarget } & (
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: string, vars: Record<string, unknown> }
)

export type AnimationDirection = 1 | -1 | 0

export type AnimationEvent = 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'

export type AnimationEventEmitter = (e: AnimationEvent, animation: Animation, parent: DejaVueInstance | null) => void

export type AnimationNestableChild = {
  parent?: DejaVueInstance | null
  position?: gsap.Position
}

export type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: unknown, triggerAction?: TweenAction, triggerOptions?: WatchOptions }
  | { trigger?: never, triggerAction?: never, triggerOptions?: never }
)

export type WrappableAnimation = (
  | { is: string | Component, target?: gsap.TweenTarget }
  | { is?: never, target?: never }
)

export type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'

export type TweenDefinition = (
  | { from: gsap.TweenVars, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from: gsap.TweenVars, to?: never, effect?: never, effectOptions?: never }
  | { from?: never, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from?: never, to?: never, effect?: string, effectOptions?: Record<string, unknown> }
)
