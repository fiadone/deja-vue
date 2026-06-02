import type { Ref, ShallowUnwrapRef } from 'vue'

import type { DejaVueComponent } from '../types'

export interface DejaVueSplitTextScopeProps {
  chars: Element[]
  words: Element[]
  lines: Element[]
}

export type DejaVueSplitTextInstance = DejaVueComponent & {
  [K in keyof DejaVueSplitTextScopeProps]: Ref<DejaVueSplitTextScopeProps[K]>
}

export type DejaVueSplitTextExposed = ShallowUnwrapRef<DejaVueSplitTextInstance>
