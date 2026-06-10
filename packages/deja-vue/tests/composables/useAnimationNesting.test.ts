import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useAnimationNesting } from '../../src/composables/useAnimationNesting'
import { Animation } from '../../src/core/Animation'
import { createParent, mountWithParent, nestedTimelines } from '../shared/helpers'

describe('useAnimationNesting', () => {
  describe('parent resolution', () => {
    it('registers via inject and explicit parent', async () => {
      const { animation: parent, instance } = createParent()
      const injected = new Animation()
      const explicit = new Animation()

      mountWithParent(() => {
        useAnimationNesting({ animation: injected })
      }, instance)
      await flushPromises()
      expect(nestedTimelines(parent)).toContain(injected.timeline)

      mountWithParent(() => {
        useAnimationNesting({ animation: explicit }, { parent: instance })
      }, instance)
      await flushPromises()
      expect(nestedTimelines(parent)).toContain(explicit.timeline)
    })

    it('opts out when parent is null and disposes on unmount', async () => {
      const { animation: parent, instance } = createParent()
      const child = new Animation()
      const wrapper = mountWithParent(() => {
        useAnimationNesting({ animation: child }, { parent: null })
      }, instance)

      await flushPromises()
      expect(nestedTimelines(parent)).toHaveLength(0)

      wrapper.unmount()
      await flushPromises()
      expect(child.timeline).toBeNull()
    })

    it('does nothing when target is omitted', async () => {
      const { animation: parent, instance } = createParent()
      const wrapper = mountWithParent(() => {
        useAnimationNesting(undefined, { parent: instance })
      }, instance)

      await flushPromises()
      expect(nestedTimelines(parent)).toHaveLength(0)
      wrapper.unmount()
    })
  })

  describe('registration', () => {
    it('adds nested animations, labels, callbacks, and positions', async () => {
      const { animation: parent, instance } = createParent()
      const callback = vi.fn()
      const position = ref<gsap.Position>(0)

      mountWithParent(() => {
        useAnimationNesting([
          { label: () => 'mark' },
          { callback }
        ], { parent: instance, position })
      }, instance)
      await flushPromises()

      expect(parent.timeline.labels).toHaveProperty('mark')
      expect(parent.timeline.getChildren().length).toBeGreaterThan(0)

      position.value = 1
      await flushPromises()
      expect(parent.timeline.getChildren().length).toBeGreaterThan(0)
    })

    it('nests multiple animations on the parent timeline', async () => {
      const { animation: parent, instance } = createParent()
      const first = new Animation()
      const second = new Animation()

      mountWithParent(() => {
        useAnimationNesting([
          { animation: first },
          { animation: second }
        ], { parent: instance })
      }, instance)
      await flushPromises()

      expect(nestedTimelines(parent)).toHaveLength(2)
      expect(second.timeline.parent).toBe(parent.timeline)
    })
  })

  describe('updates', () => {
    it('updates labels when the getter changes', async () => {
      const { animation: parent, instance } = createParent()
      const label = ref('a')

      mountWithParent(() => {
        useAnimationNesting({ label: () => label.value }, { parent: instance })
      }, instance)
      await flushPromises()
      expect(parent.timeline.labels).toHaveProperty('a')

      label.value = 'b'
      await flushPromises()

      expect(parent.timeline.labels).not.toHaveProperty('a')
      expect(parent.timeline.labels).toHaveProperty('b')
    })

    it('keeps only the latest label after rapid changes', async () => {
      const { animation: parent, instance } = createParent()
      const label = ref('a')

      mountWithParent(() => {
        useAnimationNesting({ label: () => label.value }, { parent: instance })
      }, instance)
      await flushPromises()

      label.value = 'b'
      label.value = 'c'
      await flushPromises()

      expect(parent.timeline.labels).toHaveProperty('c')
      expect(parent.timeline.labels).not.toHaveProperty('a')
      expect(parent.timeline.labels).not.toHaveProperty('b')
    })

    it('updates labels while the parent timeline is playing', async () => {
      const { animation: parent, instance } = createParent()
      const label = ref('before')

      mountWithParent(() => {
        useAnimationNesting({ label: () => label.value }, { parent: instance })
      }, instance)
      await flushPromises()

      vi.spyOn(parent.timeline, 'isActive').mockReturnValue(true)
      label.value = 'after'
      await flushPromises()

      expect(parent.timeline.labels).toHaveProperty('after')
      expect(parent.timeline.labels).not.toHaveProperty('before')
    })

    it('applies the last change when position and label update together', async () => {
      const { animation: parent, instance } = createParent()
      const label = ref('a')
      const position = ref<gsap.Position>(0)

      mountWithParent(() => {
        useAnimationNesting({ label: () => label.value }, { parent: instance, position })
      }, instance)
      await flushPromises()

      position.value = 1
      label.value = 'b'
      await flushPromises()

      expect(parent.timeline.labels).toHaveProperty('b')
      expect(parent.timeline.labels).not.toHaveProperty('a')
    })

    it('defers re-positioning nested animations while the parent is playing', async () => {
      const { animation: parent, instance } = createParent()
      const child = new Animation()
      const position = ref<gsap.Position>(0)

      mountWithParent(() => {
        useAnimationNesting({ animation: child }, { parent: instance, position })
      }, instance)
      await flushPromises()
      const startTime = child.timeline.startTime()

      vi.spyOn(parent.timeline, 'isActive').mockReturnValue(true)
      position.value = 1
      await flushPromises()
      expect(child.timeline.startTime()).toBe(startTime)

      vi.mocked(parent.timeline.isActive).mockReturnValue(false)
      parent.dispatch('complete', parent)
      await flushPromises()
      expect(child.timeline.startTime()).toBe(1)
    })
  })

  describe('removal', () => {
    it('removes all children when the resolved list becomes empty', async () => {
      const { animation: parent, instance } = createParent()
      const label = ref<string | undefined>('only')

      mountWithParent(() => {
        useAnimationNesting({ label: () => label.value }, { parent: instance })
      }, instance)
      await flushPromises()
      expect(parent.timeline.labels).toHaveProperty('only')

      label.value = undefined
      await flushPromises()

      expect(parent.timeline.labels).not.toHaveProperty('only')
      expect(parent.timeline.getChildren()).toHaveLength(0)
    })

    it('removes trailing children when the list shrinks', async () => {
      const { animation: parent, instance } = createParent()
      const callback = vi.fn()
      const label = ref<string | undefined>('intro')

      mountWithParent(() => {
        useAnimationNesting([
          { callback },
          { label: () => label.value }
        ], { parent: instance })
      }, instance)
      await flushPromises()
      expect(parent.timeline.labels).toHaveProperty('intro')

      label.value = undefined
      await flushPromises()

      expect(parent.timeline.labels).not.toHaveProperty('intro')
      expect(parent.timeline.getChildren()).toHaveLength(1)
    })
  })

  describe('revertOnDispose', () => {
    it('passes revertOnDispose to child.dispose on unmount', async () => {
      const { instance } = createParent()
      const child = new Animation()
      const dispose = vi.spyOn(child, 'dispose')

      const wrapper = mountWithParent(() => {
        useAnimationNesting({ animation: child }, { parent: instance, revertOnDispose: true })
      }, instance)

      await flushPromises()
      wrapper.unmount()
      await flushPromises()

      expect(dispose).toHaveBeenCalledWith(true)
    })

    it('disposes without revert when revertOnDispose is omitted', async () => {
      const { instance } = createParent()
      const child = new Animation()
      const dispose = vi.spyOn(child, 'dispose')

      const wrapper = mountWithParent(() => {
        useAnimationNesting({ animation: child }, { parent: instance })
      }, instance)

      await flushPromises()
      wrapper.unmount()
      await flushPromises()

      expect(dispose).toHaveBeenCalledWith(undefined)
    })
  })

  describe('unmount', () => {
    it('force-removes and disposes nested animations', async () => {
      const { animation: parent, instance } = createParent()
      const child = new Animation()
      const wrapper = mountWithParent(() => {
        useAnimationNesting({ animation: child }, { parent: instance })
      }, instance)

      await flushPromises()
      expect(nestedTimelines(parent)).toContain(child.timeline)

      wrapper.unmount()
      await flushPromises()

      expect(nestedTimelines(parent)).not.toContain(child.timeline)
      expect(child.timeline).toBeNull()
    })

    it('can register again after a full teardown', async () => {
      const { animation: parent, instance } = createParent()
      const first = new Animation()
      const second = new Animation()
      const wrapper = mountWithParent(() => {
        useAnimationNesting([
          { animation: first },
          { animation: second }
        ], { parent: instance })
      }, instance)

      await flushPromises()
      wrapper.unmount()
      await flushPromises()
      expect(second.timeline).toBeNull()

      const again = new Animation()
      mountWithParent(() => {
        useAnimationNesting({ animation: again }, { parent: instance })
      }, instance)
      await flushPromises()

      expect(nestedTimelines(parent)).toHaveLength(1)
      expect(again.timeline.parent).toBe(parent.timeline)
    })
  })
})
