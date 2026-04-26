import type { InjectionKey } from 'vue'
import type { AnimationInstance } from './types'

export const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as const

export const parentAnimationInjectionKey: InjectionKey<AnimationInstance> = Symbol('parent-animation')
