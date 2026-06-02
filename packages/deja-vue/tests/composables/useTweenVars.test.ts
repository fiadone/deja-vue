import { describe, expect, it } from 'vitest'

import { useTweenVars } from '../../src/composables/useTweenVars'
import { runComposable } from '../shared/helpers'

describe('useTweenVars', () => {
  it('uses fromTo when from and to are provided', () => {
    const { result } = runComposable(() => useTweenVars({
      from: { opacity: 0 },
      to: { opacity: 1 }
    }))

    expect(result.method.value).toBe('fromTo')
    expect(result.vars.value).toEqual([{ opacity: 0 }, { opacity: 1 }])
  })

  it('uses from when only from is provided', () => {
    const { result } = runComposable(() => useTweenVars({
      from: { x: 0 }
    }))

    expect(result.method.value).toBe('from')
    expect(result.vars.value).toEqual({ x: 0 })
  })

  it('uses to when only to is provided', () => {
    const { result } = runComposable(() => useTweenVars({
      to: { y: 100 }
    }))

    expect(result.method.value).toBe('to')
    expect(result.vars.value).toEqual({ y: 100 })
  })

  it('uses a custom effect when effect is provided', () => {
    const { result } = runComposable(() => useTweenVars({
      effect: 'set',
      effectOptions: { opacity: 0.5 }
    }))

    expect(result.method.value).toBe('set')
    expect(result.vars.value).toEqual({ opacity: 0.5 })
  })
})
