# Animation Controls

Déjà Vue provides reactive props (`progress` and `toggle`) to control your animations dynamically based on component state.

## Overview

Two main control mechanisms:
- **`progress`** - Scrub through an animation (0-1)
- **`toggle`** - Play/reverse the animation

## Progress Control

Use the `progress` prop to scrub through an animation:

```vue
<template>
  <div>
    <input 
      v-model.number="progress" 
      type="range" 
      min="0" 
      max="1" 
      step="0.01"
    >
    <div>Progress: {{ (progress * 100).toFixed(0) }}%</div>
    
    <Tween
      method="to"
      :progress
      :vars="{ x: 200, duration: 2 }"
    >
      <div>Controlled Animation</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0.5)
</script>
```

When `progress` is set:
- The animation is **paused** at that progress point
- Values are continuous (0.0 to 1.0)
- Perfect for scrubbing/scrubber UI
- Animation snaps to the exact frame instantly

## Toggle Control

Use the `toggle` prop to play or reverse animations:

```vue
<template>
  <div>
    <button @click="isPlaying = !isPlaying">
      {{ isPlaying ? '⏸ Pause' : '▶ Play' }}
    </button>
    
    <Tween 
      method="to" 
      :toggle="isPlaying"
      :vars="{ rotation: 360, duration: 3, repeat: -1 }" 
    >
      <div class="spinner">Spinning</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const isPlaying = ref(false)
</script>
```

When `toggle` is provided:
- `true` = play animation
- `false` = reverse animation
- Perfect for play/pause buttons
- `undefined` = default behavior (auto-play)

## Combining Controls

You can use both `progress` and `toggle` together:

```vue
<template>
  <div>
    <div class="controls">
      <button @click="playing = !playing">
        {{ playing ? '⏸ Pause' : '▶ Play' }}
      </button>
      <input 
        v-model.number="progress" 
        type="range" 
        min="0" 
        max="1" 
        step="0.01"
      >
      <span>{{ (progress * 100).toFixed(0) }}%</span>
    </div>
    
    <Timeline 
      :tweens
      :progress
      :toggle="playing"
    >
      <div class="content">Complex Animation</div>
    </Timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timeline } from 'deja-vue'

const playing = ref(false)
const progress = ref(0)
const tweens = [
  { method: 'to', vars: { x: 100, duration: 1 } },
  { method: 'to', vars: { y: 100, duration: 1 }, position: '+=0.5' },
  { method: 'to', vars: { rotation: 360, duration: 1 }, position: '+=0.5' }
]
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.content {
  width: 100px;
  height: 100px;
  background: blue;
}
</style>
```

## Reactive Updates

Controls are fully reactive and work with computed properties and watchers:

```vue
<template>
  <div>
    <input v-model.number="position" type="range" min="0" max="1" step="0.0001">
    <Tween
      method="to"
      :progress
      :vars="{ x: 300, duration: 1 }"
    >
      <div>Moving Element</div>
    </Tween>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Tween } from 'deja-vue'

const progress = ref(0)
</script>
```

## Programmatic Control

Access the animation instance for direct GSAP timeline control:

```vue
<template>
  <div>
    <button @click="play">Play</button>
    <button @click="pause">Pause</button>
    <button @click="reverse">Reverse</button>
    <button @click="seek(0.5)">Seek to 50%</button>
    
    <Tween
      ref="tweenRef"
      method="to"
      :vars="{ x: 100, duration: 1 }"
    >
      <div>Programmatic Control</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const tweenRef = ref()

const play = () => tweenRef.value.animation.timeline.play()
const pause = () => tweenRef.value.animation.timeline.pause()
const reverse = () => tweenRef.value.animation.timeline.reverse()
const seek = (progress) => tweenRef.value.animation.timeline.progress(progress)
</script>
```

## Common Patterns

### Video Player Style Scrubber

```vue
<template>
  <div class="video-player">
    <div class="preview">
      <Timeline :tweens="frameTweens" :progress="currentFrame / totalFrames">
        <div class="frame" />
      </Timeline>
    </div>
    
    <input 
      v-model.number="currentFrame" 
      type="range"
      :max="totalFrames"
      @input="isPlaying = false"
    >
    <button @click="isPlaying = !isPlaying">
      {{ isPlaying ? 'Pause' : 'Play' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timeline } from 'deja-vue'

const isPlaying = ref(false)
const currentFrame = ref(0)
const totalFrames = ref(100)
const frameTweens = [
  { method: 'to', vars: { rotation: 360, duration: 1 } }
]

// Auto-playback
setInterval(() => {
  if (!isPlaying.value) return
  currentFrame.value = (currentFrame.value + 1) % totalFrames.value
}, 16) // ~60fps
</script>
```

### Scroll-Triggered Animation

```vue
<template>
  <div class="scroll-container" @scroll="onScroll">
    <Tween 
      method="to" 
      :vars="{ x: 200, duration: 1 }"
      :progress="scrollProgress"
    >
      <div>Scroll to animate</div>
    </Tween>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const scrollProgress = ref(0)

const onScroll = (e) => {
  const { scrollLeft, scrollWidth, clientWidth } = e.target
  scrollProgress.value = scrollLeft / (scrollWidth - clientWidth)
}
</script>
```

### Hover Animations

```vue
<template>
  <Tween 
    method="to" 
    :vars="{ scale: 1.1, duration: 0.3 }"
    :toggle="isHovered"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="button">Hover me</div>
  </Tween>
</template>

<script setup>
import { ref } from 'vue'
import { Tween } from 'deja-vue'

const isHovered = ref(false)
</script>
```
