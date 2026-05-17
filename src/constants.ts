import type { InjectionKey } from 'vue'

import type { AnimationEvent, DejaVueInstance } from './types'

export const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as AnimationEvent[]

export const dejaVueParentInstance: InjectionKey<DejaVueInstance> = Symbol('deja-vue-parent-instance')
