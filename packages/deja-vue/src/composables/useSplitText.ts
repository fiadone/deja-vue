import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { MaybeRefOrGetter } from 'vue'
import { computed, onUnmounted, shallowReactive, shallowRef, toRefs, toValue, watchEffect } from 'vue'

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

export function useSplitText (domTarget: MaybeRefOrGetter<gsap.DOMTarget>, options?: SplitTextOptions) {
  const target = computed(() => toValue(domTarget))
  const instance = shallowRef<SplitText>()
  const state = shallowReactive({
    chars: [] as Element[],
    lines: [] as Element[],
    words: [] as Element[]
  })
  
  watchEffect(() => {
    instance.value?.kill()
    if (!target.value) return
    instance.value = new SplitText(target.value, {
      ...options,
      type: options?.type || 'lines,words,chars',
      onSplit (self) {
        options?.onSplit?.(self)
        state.lines = self.lines
        state.words = self.words
        state.chars = self.chars
      }
    })
  })

  onUnmounted(() => instance.value?.kill())

  return {
    instance,
    state,
    ...toRefs(state)
  }
}