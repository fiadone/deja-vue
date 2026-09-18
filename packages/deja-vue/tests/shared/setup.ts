import gsap from 'gsap/dist'
import { afterEach } from 'vitest'

afterEach(() => {
  gsap.globalTimeline.clear()
  gsap.killTweensOf('*')
})
