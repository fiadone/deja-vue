import { gsap } from 'gsap'
import { afterEach } from 'vitest'

afterEach(() => {
  gsap.globalTimeline.clear()
  gsap.killTweensOf('*')
})
