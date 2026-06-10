import type { Component, ComputedRef, MaybeRef, ModelRef, Ref, ShallowRef, ShallowUnwrapRef, WatchOptions } from 'vue'
import type { NodeRef } from 'vue-unwrap'

import type { Animation } from './core/Animation'

export type NonEmptyArray<T> = [T, ...T[]]
export type PlainObject<T> = [T] extends [readonly unknown[]] ? never : T

export type DejaVueNode = NodeRef | ShallowUnwrapRef<DejaVueComponent>

export interface DejaVueComponent {
  $el: ShallowRef<Element | null>
  seamless?: MaybeRef<boolean | undefined>
  tweenTarget: ComputedRef<gsap.TweenTarget>
}

export interface DejaVueAnimationInstance extends DejaVueComponent {
  animation: Animation
  controlled: boolean
  direction: Ref<AnimationDirection>
  parent: DejaVueAnimationParent | null
  progress: ModelRef<ControllableAnimation['progress']>
}

export interface DejaVueAnimationComponentProps {
  revertOnDispose?: boolean
  seamless?: boolean
  tweenTarget?: 'children' | 'self' | gsap.TweenTarget
}

export type DejaVueAnimationExposed = ShallowUnwrapRef<DejaVueAnimationInstance>
export type DejaVueAnimationParent = DejaVueAnimationInstance | DejaVueAnimationExposed
export type DejaVueAnimationScopeProps = Pick<DejaVueAnimationExposed, 'animation' | 'direction' | 'parent' | 'progress'>

export type AnimationChild = Animation | gsap.Callback | string

export type AnimationComposeDefinition = { scope?: Element, target: gsap.TweenTarget } & (
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: string, vars: Record<string, unknown> }
)

export type AnimationDirection = 1 | -1 | 0

export type AnimationEvent = 'complete' | 'interrupt' | 'repeat' | 'reverseComplete' | 'start' | 'update'

export type AnimationEventEmitter = (e: AnimationEvent, animation: Animation, parent: DejaVueAnimationParent | null) => void

export interface AnimationNestableChild {
  parent?: DejaVueAnimationParent | null
  position?: gsap.Position
}

export interface AnimationTriggerOptions extends WatchOptions {
  actionArgs?: any[]
}

export type ControllableAnimation = {
  progress?: number
} & (
  | { trigger?: unknown, triggerAction?: TweenAction, triggerOptions?: AnimationTriggerOptions }
  | { trigger?: never, triggerAction?: never, triggerOptions?: never }
)

export type TweenAction = 'play' | 'pause' | 'reset' | 'restart' | 'resume' | 'reverse'

export type TweenDefinition = (
  | { from: gsap.TweenVars, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from: gsap.TweenVars, to?: never, effect?: never, effectOptions?: never }
  | { from?: never, to: gsap.TweenVars, effect?: never, effectOptions?: never }
  | { from?: never, to?: never, effect?: string, effectOptions?: gsap.TweenVars }
)

export interface WrappableComponent {
  is?: string | Component
}
