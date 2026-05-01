<script setup lang="ts">
import { shallowReactive, shallowRef, useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { Callback, PositionMarker, Timeline, Tween } from '../../src'
import { FADE_IN, GROW_IN, SLIDE_IN, COMPLEX } from './animations'

const rootTimeline = useTemplateRef<ComponentPublicInstance<typeof Timeline>>('rootTimeline')
const progress = shallowRef(0)
const toggle = shallowRef(false)
const completedAnimations = shallowReactive<Set<number>>(new Set())

function callback () {
  alert('Callback')
  if (completedAnimations.has(4)) {
    completedAnimations.delete(4)
  } else {
    completedAnimations.add(4)
  }
}

function onMarkerCross () {
  if (completedAnimations.has(1)) {
    completedAnimations.delete(1)
  } else {
    completedAnimations.add(1)
  }
}

function onProgressInput () {
  rootTimeline.value?.animation.timeline.pause()
}

function onRootTimelineUpdate (timeline: gsap.core.Timeline) {
  progress.value = timeline.progress()
}
</script>

<template>
  <div class="flex flex-col size-full">
    <header class="p-4">
      <h1 class="text-center">Animation tree</h1>
    </header>

    <main class="flex flex-auto flex-col items-center justify-center gap-4 p-4 mx-auto">
      <div ref="content" class="flex flex-col gap-3 w-80">
        <Timeline
          ref="rootTimeline"
          :progress
          :toggle
          @update="onRootTimelineUpdate"
        >
          <!-- 1. -->
          <section :class="{ 'border-green!': completedAnimations.has(0) }">
            <span>1. Tween</span>
            <Tween
              v-bind="GROW_IN"
              class="w-full h-10"
              @start="completedAnimations.add(0)"
              @reverse-complete="completedAnimations.delete(0)"
            >
              <div class="w-full h-10 rounded-xl bg-red" />
            </Tween>
          </section>

          <!-- 2. -->
          <section :class="{ 'border-green!': completedAnimations.has(1) }">
            <span>2. PositionMarker</span>
            <PositionMarker label="marker" @cross="onMarkerCross" />
          </section>

          <div class="flex items-center gap-3">
            <!-- 3. -->
            <section :class="{ 'border-green!': completedAnimations.has(2) }">
              <span>3. Tween</span>
              <Tween
                v-bind="FADE_IN"
                class="w-full h-10 rounded-xl mx-auto bg-green"
                @start="completedAnimations.add(2)"
                @reverse-complete="completedAnimations.delete(2)"
              />
            </section>

            <!-- 4. -->
            <section class="flex-auto" :class="{ 'border-green!': completedAnimations.has(3) }">
              <span>4. Tween group</span>
              <Tween
                v-bind="SLIDE_IN"
                class="flex gap-2"
                group
                @start="completedAnimations.add(3)"
                @reverse-complete="completedAnimations.delete(3)"
              >
                <div class="flex-1 h-10 rounded-xl bg-red" />
                <div class="flex-1 h-10 rounded-xl bg-green" />
                <div class="flex-1 h-10 rounded-xl bg-blue" />
              </Tween>
            </section>
          </div>

          <!-- 5. -->
          <section :class="{ 'border-green!': completedAnimations.has(4) }">
            <span>5. Callback</span>
            <Callback :fn="callback" />
          </section>

          <!-- 6. -->
          <section :class="{ 'border-green!': completedAnimations.has(5) }">
            <span>6. Timeline (playing at Marker)</span>
            <Timeline
              group
              position="marker"
              :tweens="COMPLEX"
              class="space-y-2"
              @start="completedAnimations.add(5)"
              @reverse-complete="completedAnimations.delete(5)"
            >
              <div class="size-10 rounded-xl bg-red" />
              <div class="size-10 rounded-xl bg-green" />
              <div class="size-10 rounded-xl bg-blue" />
            </Timeline>
          </section>
        </Timeline>
      </div>
    </main>

    <footer class="flex flex-shrink-0 items-center justify-between gap-4 h-20 p-4">
      <button type="button" class="w-30" @click="toggle = !toggle">{{ toggle ? 'Reverse' : 'Play' }}</button>
      <input
        v-model.number="progress"
        class="flex-auto"
        type="range"
        :min="0"
        :max="1"
        :step="0.0001"
        @input="onProgressInput"
      >
    </footer>
  </div>
</template>

<style scoped>
section {
  border: solid 1px rgba(255, 255, 255, .25);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  padding: 0.75rem;
  position: relative;
  transition: border-color 0.3s;
}

span {
  font-size: 0.75rem;
  line-height: 1;
  text-transform: uppercase;
}
</style>