import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { DejaVueSplitTextExposed } from '../../src/components/SplitText.types'
import { getExposed, mountSplitText } from '../shared/helpers'

describe('SplitText', () => {
  describe('instance', () => {
    it('exposes split lines, words, chars, and tweenTarget', async () => {
      const wrapper = await mountSplitText({ props: { type: 'words,chars' } })
      const instance = getExposed<DejaVueSplitTextExposed>(wrapper)

      expect(instance.words.length).toBeGreaterThan(0)
      expect(instance.chars.length).toBeGreaterThan(0)
      expect(instance.tweenTarget).toBeTruthy()
      expect(instance.seamless).toBe(true)
      wrapper.unmount()
    })
  })

  describe('events', () => {
    it('emits split when text is divided', async () => {
      const wrapper = await mountSplitText({ props: { type: 'words' } })
      expect(wrapper.emitted('split')?.length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    it('emits revert when the split instance is reverted', async () => {
      const wrapper = await mountSplitText({ props: { type: 'words' } })
      const split = wrapper.emitted('split')?.[0]?.[0] as { revert: () => void }

      split.revert()
      expect(wrapper.emitted('revert')?.length).toBeGreaterThan(0)
      wrapper.unmount()
    })
  })

  describe('tweenTarget', () => {
    it('uses the tweenTarget prop when provided', async () => {
      const wrapper = await mountSplitText({ props: { tweenTarget: 'words', type: 'lines,words,chars' } })
      const instance = getExposed<DejaVueSplitTextExposed>(wrapper)

      expect(instance.tweenTarget).toEqual(instance.words)
      wrapper.unmount()
    })

    it('derives tweenTarget from the last type segment', async () => {
      const wrapper = await mountSplitText({ props: { type: 'lines,words' } })
      const instance = getExposed<DejaVueSplitTextExposed>(wrapper)

      expect(instance.tweenTarget).toEqual(instance.words)
      wrapper.unmount()
    })

    it('defaults tweenTarget to chars when type and tweenTarget are omitted', async () => {
      const wrapper = await mountSplitText({ props: {} })
      const instance = getExposed<DejaVueSplitTextExposed>(wrapper)

      expect(instance.tweenTarget).toEqual(instance.chars)
      wrapper.unmount()
    })

    it('returns null for unknown tweenTarget keys', async () => {
      const wrapper = await mountSplitText({ props: { tweenTarget: 'nope' as 'words', type: 'words' } })
      expect(getExposed<DejaVueSplitTextExposed>(wrapper).tweenTarget).toBeNull()
      wrapper.unmount()
    })
  })

  it('uses the root element as target when the wrapper has is', async () => {
    const wrapper = await mountSplitText({
      attrs: { is: 'p' },
      props: { type: 'words' },
      slots: { default: () => h('p', { class: 'split-copy' }, 'Wrapped') }
    })

    expect(wrapper.emitted('split')?.length).toBeGreaterThan(0)
    wrapper.unmount()
  })
})
