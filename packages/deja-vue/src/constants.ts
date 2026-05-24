import type { InjectionKey } from 'vue'

import type { AnimationEvent, DejaVueAnimationPublicInstance } from './types'

export const ANIMATION_EVENTS = ['complete', 'interrupt', 'repeat', 'reverseComplete', 'start', 'update'] as AnimationEvent[]

export const dejaVueParentInstance: InjectionKey<DejaVueAnimationPublicInstance> = Symbol('deja-vue-parent-instance')
