import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSplitText } from '../../src/composables/useSplitText'
import { runComposable } from '../shared/helpers'

describe('useSplitText', () => {
  it('defaults type when options omit it', async () => {
    const target = document.createElement('p')
    target.textContent = 'Hello'

    const { result, unmount } = runComposable(() => useSplitText(ref(target), ref({})))
    await nextTick()

    expect(result.chars.value.length).toBeGreaterThan(0)
    expect(result.words.value.length).toBeGreaterThan(0)
    expect(result.lines.value.length).toBeGreaterThan(0)
    unmount()
  })

  it('forwards onSplit to options and updates state', async () => {
    const target = document.createElement('p')
    target.textContent = 'Hi'
    const onSplit = vi.fn()

    runComposable(() => useSplitText(ref(target), ref({ onSplit, type: 'words' })))
    await nextTick()

    expect(onSplit).toHaveBeenCalled()
  })

  it('recreates the instance when the DOM target changes', async () => {
    const first = document.createElement('p')
    first.textContent = 'One'
    const second = document.createElement('p')
    second.textContent = 'Two'
    const target = ref(first)

    const { unmount } = runComposable(() => useSplitText(target, ref({ type: 'words' })))
    await nextTick()

    target.value = second
    await nextTick()
    unmount()
  })
})
