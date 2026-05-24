<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, useAttrs } from 'vue'
import { getNodeElement, useUnwrap } from 'vue-unwrap'

import type { SplitTextOptions } from '../composables/useSplitText'
import { useSplitText } from '../composables/useSplitText'
import type { DejaVueComponent, DejaVueNode, WrappableComponent } from '../types'
import { toNonEmptyArray } from '../utils'

export interface DejaVueSplitTextScopeProps {
  chars: Element[]
  words: Element[]
  lines: Element[]
}

export type DejaVueSplitTextPublicInstance = DejaVueComponent & {
  [K in keyof DejaVueSplitTextScopeProps]: Ref<DejaVueSplitTextScopeProps[K]>
}

const SplitTextPropTypes = {
  chars: Object as PropType<Element[]>,
  lines: Object as PropType<Element[]>,
  words: Object as PropType<Element[]>
}

const props = defineProps<SplitTextOptions & { tweenTarget?: 'lines' | 'words' | 'chars' }>()

const attrs = useAttrs() as WrappableComponent

const { children, root, Unwrap } = useUnwrap<DejaVueNode, SplitTextOptions>(SplitTextPropTypes)
const target = computed(() => attrs.is ? root.value : toNonEmptyArray(children.map(child => getNodeElement(child)).filter(Boolean)))
const { chars, lines, state, words } = useSplitText(target, props)
const tweenTarget = computed(() => {
  const key = props.tweenTarget || (props.type?.split(',').pop()?.trim() as 'lines' | 'words' | 'chars') || 'chars'
  if (!(key in state)) return null
  return toNonEmptyArray(state[key])
})

const seamless = true
const instance: DejaVueSplitTextPublicInstance = {
  $el: root,
  chars,
  lines,
  seamless,
  tweenTarget,
  words
}

defineExpose(instance)

defineSlots<{ default(props: DejaVueSplitTextScopeProps): any }>()
</script>

<template>
  <Unwrap
    :chars
    :lines
    :words
  />
</template>
