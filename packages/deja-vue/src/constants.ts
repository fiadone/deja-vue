import type { InjectionKey } from 'vue'

import type { AnimationEvent, DejaVueAnimationInstance } from './types'

export const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as AnimationEvent[]

export const dejaVueParentInstance: InjectionKey<DejaVueAnimationInstance> = Symbol('deja-vue-parent-instance')
