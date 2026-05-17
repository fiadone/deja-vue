import type { Component, ComputedRef, ModelRef, Ref, ShallowRef, UnwrapRef } from 'vue'
import type { NodeRef } from 'vue-unwrap'

import type { Animation } from './utils/Animation'

export type NonEmptyArray<T> = [T, ...T[]]

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
  | { trigger?: boolean, triggerActions?: TweenAction | [TweenAction, TweenAction] }
  | { trigger?: never, triggerActions?: never }
)

export type WrappableAnimation = (
  | { is: string | Component, target?: gsap.TweenTarget }
  | { is?: never, target?: never }
)

export type TweenAction = 'play' | 'pause' | 'restart' | 'resume' | 'reverse'

export type TweenDefinition = (
  | { method: 'from' | 'to', vars: gsap.TweenVars }
  | { method: 'fromTo', vars: [gsap.TweenVars, gsap.TweenVars] }
  | { method: `effect:${string}`, vars?: gsap.TweenVars }
)
