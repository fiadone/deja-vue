<script setup lang="ts">
import type { SplitText } from 'gsap/SplitText'
import type { PropType } from 'vue'
import { computed, useAttrs } from 'vue'
import { getNodeElement, useUnwrap } from 'vue-unwrap'

import type { SplitTextOptions } from '../composables/useSplitText'
import { useSplitText } from '../composables/useSplitText'
import type { DejaVueNode, WrappableComponent } from '../types'
import { toNonEmptyArray } from '../utils'
import type { DejaVueSplitTextInstance, DejaVueSplitTextScopeProps } from './SplitText.types'

const SplitTextPropTypes = {
  chars: Object as PropType<Element[]>,
  lines: Object as PropType<Element[]>,
  words: Object as PropType<Element[]>
}

const props = defineProps<SplitTextOptions & {
  tweenTarget?: 'lines' | 'words' | 'chars'
}>()

const emit = defineEmits<{
  (e: 'split', splitText: SplitText): void
  (e: 'revert', splitText: SplitText): void
}>()

const attrs = useAttrs() as WrappableComponent

const { children, root, Unwrap } = useUnwrap<DejaVueNode, DejaVueSplitTextScopeProps>(SplitTextPropTypes)
const target = computed(() => attrs.is ? root.value : toNonEmptyArray(children.map(child => getNodeElement(child)).filter(Boolean)))
const options = computed(() => {
  const { tweenTarget, ...rest } = props
  return {
    ...rest,
    onRevert: (self: SplitText) => emit('revert', self),
    onSplit: (self: SplitText) => emit('split', self)
  }
})

const { chars, lines, state, words } = useSplitText(target, options)
const tweenTarget = computed(() => {
  const key = props.tweenTarget || (props.type?.split(',').pop()?.trim() as 'lines' | 'words' | 'chars') || 'chars'
  if (!(key in state)) return null
  return toNonEmptyArray(state[key])
})

const seamless = true
const instance: DejaVueSplitTextInstance = {
  $el: root,
  chars,
  lines,
  seamless,
  tweenTarget,
  words
}

defineExpose<DejaVueSplitTextInstance>(instance)
defineSlots<{ default(props: DejaVueSplitTextScopeProps): any }>()
</script>

<template>
  <Unwrap
    :chars
    :lines
    :words
  />
</template>
