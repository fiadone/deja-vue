import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { readonly, ref } from 'vue'

const lenis = new Lenis()
const y = ref(0)

gsap.ticker.add(t => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

lenis.on('scroll', e => {
  ScrollTrigger.update()
  y.value = e.scroll
})

export const scrollY = readonly(y)

export default lenis
