import type { MaybeRefOrGetter, Reactive } from 'vue'
import { computed, reactive, toValue, watch } from 'vue'

import type { PlainObject } from '../types'
import { cloneObject, patchObject } from '../utils'

export function useStableObjectProp<T extends object> (objectProp: MaybeRefOrGetter<PlainObject<T> | null | undefined>): Reactive<T> {
  const computedObject = computed(() => toValue(objectProp) || {} as T)
  const stableObject = reactive(cloneObject(computedObject.value))

  watch(computedObject, updatedObject => patchObject(stableObject as T, updatedObject), { flush: 'sync' })

  return stableObject
}
