import type { Component, ComputedRef, MaybeRefOrGetter, ModelRef, Ref, ShallowRef, UnwrapRef, WatchOptions } from 'vue'
import type { NodeRef } from 'vue-unwrap'

import type { Animation } from './core/Animation'

export type NonEmptyArray<T> = [T, ...T[]]
export type PlainObject<T> = [T] extends [readonly unknown[]] ? never : T

export type DejaVueNode = NodeRef | {
  [K in keyof DejaVueComponent]: UnwrapRef<DejaVueComponent[K]>
}

export interface DejaVueComponent {
  $el: ShallowRef<Element | null>
  seamless?: MaybeRefOrGetter<boolean>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}

export interface DejaVueAnimationPublicInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection>
  parent: DejaVueAnimationPublicInstance | null
  progress: ModelRef<ControllableAnimation['progress']>
}

export type DejaVueAnimationScopeProps = {
  [K in keyof Omit<DejaVueAnimationPublicInstance, keyof DejaVueComponent | 'controlled' | 'parent'>]: UnwrapRef<DejaVueAnimationPublicInstance[K]>
} & { parent: DejaVueAnimationPublicInstance | null }

export type AnimationChild = Animation | gsap.Callback | string

export type AnimationComposeDefinition = { scope?: Element, target: gsap.TweenTarget } & (
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: string, vars: Record<string, unknown> }
)

export type AnimationDirection = 1 | -1 | 0

export type AnimationEvent = 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'

export type AnimationEventEmitter = (e: AnimationEvent, animation: Animation, parent: DejaVueAnimationPublicInstance | null) => void

export type AnimationNestableChild = {
  parent?: DejaVueAnimationPublicInstance | null
  position?: gsap.Position
}

export type AnimationTarget = gsap.TweenTarget | 'self' | 'children'

export type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: unknown, triggerAction?: TweenAction, triggerOptions?: WatchOptions }
  | { trigger?: never, triggerAction?: never, triggerOptions?: never }
)

export type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'

export type TweenDefinition = (
  | { from: gsap.TweenVars, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from: gsap.TweenVars, to?: never, effect?: never, effectOptions?: never }
  | { from?: never, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from?: never, to?: never, effect?: string, effectOptions?: Record<string, unknown> }
)

export interface WrappableComponent {
  is?: string | Component
}
