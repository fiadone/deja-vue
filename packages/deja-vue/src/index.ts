export type * from './types'

export * from './constants'
export * from './utils'

export { Animation } from './core/Animation'
export { useAnimationControls, type AnimationControls } from './composables/useAnimationControls'
export { useAnimationNesting, type AnimationNestingTarget } from './composables/useAnimationNesting'
export { useAnimationScope } from './composables/useAnimationScope'
export { useSplitText, type SplitTextOptions } from './composables/useSplitText'
export { useStableObjectProp } from './composables/useStableObjectProp'
export { useTweenVars } from './composables/useTweenVars'

export { default as Timeline } from './components/Timeline.vue'
export { default as Tween } from './components/Tween.vue'

export {
  default as Marker,
  type DejaVueMarkerPublicInstance,
  type DejaVueMarkerScopeProps
} from './components/Marker.vue'

export {
  default as SplitText,
  type DejaVueSplitTextPublicInstance,
  type DejaVueSplitTextScopeProps
} from './components/SplitText.vue'
