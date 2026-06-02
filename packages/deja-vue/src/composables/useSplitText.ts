import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { MaybeRefOrGetter } from 'vue'
import { onUnmounted, shallowReactive, shallowRef, toRefs, toValue, watch } from 'vue'

import { cloneObject } from '../utils'

gsap.registerPlugin(SplitText)

// reconstruct the SplitText.Vars to make it compatible with Vue's props definition,
// since the original type from GSAP includes an index signature ([key: string]: any)
// which prevents Vue's defineProps from resolving a finite prop shape at compile time
export interface SplitTextOptions {
  type?: string
  mask?: 'lines' | 'words' | 'chars'
  wordDelimiter?: string | RegExp | SplitText.WordDelimiterConfig
  linesClass?: string
  wordsClass?: string
  charsClass?: string
  aria?: 'auto' | 'hidden' | 'none'
  tag?: string
  propIndex?: boolean
  deepSlice?: boolean
  smartWrap?: boolean
  specialChars?: string[] | RegExp
  reduceWhiteSpace?: boolean
  autoSplit?: boolean
  ignore?: SplitText.SplitTextTarget
  prepareText?: SplitText.PrepareTextFunction
  onSplit?: (splitText: SplitText) => void
  onRevert?: (splitText: SplitText) => void
  overwrite?: boolean
}

export function useSplitText (domTarget: MaybeRefOrGetter<gsap.DOMTarget>, options: MaybeRefOrGetter<SplitTextOptions>) {
  const instance = shallowRef<SplitText>()
  const state = shallowReactive({
    chars: [] as Element[],
    lines: [] as Element[],
    words: [] as Element[]
  })

  watch([() => toValue(domTarget), () => toValue(options)], ([target, vars]) => {
    instance.value?.kill()
    if (!target || !vars) return
    instance.value = new SplitText(target, {
      ...cloneObject(vars),
      type: vars.type || 'lines,words,chars',
      onSplit (self) {
        vars.onSplit?.(self)
        state.lines = self.lines
        state.words = self.words
        state.chars = self.chars
      }
    })
  }, { immediate: true })

  onUnmounted(() => instance.value?.kill())

  return {
    instance,
    state,
    ...toRefs(state)
  }
}