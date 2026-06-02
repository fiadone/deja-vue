import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import { useStableObjectProp } from '../../src/composables/useStableObjectProp'
import { runComposable } from '../shared/helpers'

describe('useStableObjectProp', () => {
  it('patches the same reactive object when the source changes', async () => {
    const source = ref<Record<string, number>>({ a: 1, b: 2 })
    const { result } = runComposable(() => useStableObjectProp(() => source.value))

    expect(result).toEqual({ a: 1, b: 2 })
    source.value = { a: 1, b: 3, c: 4 }
    await nextTick()
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
    expect(result).not.toBe(source.value)
  })

  it('removes keys dropped from the source', async () => {
    const source = ref<Record<string, number>>({ drop: 2, keep: 1 })
    const { result } = runComposable(() => useStableObjectProp(() => source.value))

    source.value = { keep: 1 }
    await nextTick()
    expect(result).toEqual({ keep: 1 })
    expect('drop' in result).toBe(false)
  })
})
