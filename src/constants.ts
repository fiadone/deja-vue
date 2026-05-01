import type { InjectionKey } from 'vue'
import type { Animation } from './utils/Animation'

export const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as const

export const parentAnimationInjectionKey: InjectionKey<Animation> = Symbol('parent-animation')
