import type { Ref, ShallowUnwrapRef } from 'vue'

import type { DejaVueAnimationParent } from '../types'

export interface DejaVueMarkerInstance {
  crossed: Ref<boolean>
  parent: DejaVueAnimationParent | null
}

export type DejaVueMarkerExposed = ShallowUnwrapRef<DejaVueMarkerInstance>

export type DejaVueMarkerScopeProps = Pick<DejaVueMarkerExposed, 'crossed' | 'parent'>
