<script setup lang="ts">
import type { Component, PropType } from 'vue'
import { computed, toRefs, useAttrs } from 'vue'
import { getNodeElement, useUnwrap } from 'vue-unwrap'

import type { SplitTextOptions } from '../composables/useSplitText'
import { useSplitText } from '../composables/useSplitText'
import type { DejaVueNode } from '../types'
import { toNonEmptyArray } from '../utils'

const attrs = useAttrs() as { is?: string | Component, tweenTarget?: 'lines' | 'words' | 'chars' }

const props = defineProps<SplitTextOptions>()

const { $el, children, Unwrap } = useUnwrap<DejaVueNode, SplitTextOptions>({ target: [String, Object] as PropType<gsap.TweenTarget> })
const splitTextTarget = computed(() => attrs.is ? $el.value : toNonEmptyArray(children.map(child => getNodeElement(child)).filter(Boolean)))
const { state } = useSplitText(splitTextTarget, props)
const target = computed(() => {
  const key = attrs.tweenTarget || (props.type?.split(',').pop()?.trim() as 'lines' | 'words' | 'chars') || 'chars'
  if (!(key in state)) return null
  return toNonEmptyArray(state[key])
})

defineExpose({
  $el,
  target,
  seamless: true,
  ...toRefs(state)
})
</script>

<template>
  <Unwrap :target />
</template>
