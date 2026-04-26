export const FADE_IN = {
  method: 'from' as const,
  vars: { autoAlpha: 0, stagger: 0.1 }
}

export const GROW_IN = {
  method: 'fromTo' as const,
  vars: [
    { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
    { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', stagger: 0.1 }
  ]
}

export const SLIDE_IN = {
  method: 'from' as const,
  vars: { autoAlpha: 0, yPercent: 50, stagger: 0.1 }
}

export const COMPLEX = [
  {
    method: 'from' as const,
    vars: { scale: 0, rotate: 180, stagger: 0.1 }
  },
  {
    method: 'to' as const,
    vars: { x: 254, stagger: 0.1 }
  },
  {
    method: 'to' as const,
    vars: { rotate: 180, stagger: 0.1 }
  },
  {
    method: 'to' as const,
    vars: { xPercent: 0, stagger: 0.1 }
  }
]