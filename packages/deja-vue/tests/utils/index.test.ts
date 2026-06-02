import { describe, expect, it } from 'vitest'

import { cloneObject, syncData, toNonEmptyArray } from '../../src/utils'

describe('toNonEmptyArray', () => {
  it('returns null for an empty array', () => {
    expect(toNonEmptyArray([])).toBeNull()
  })

  it('returns the array when it has items', () => {
    expect(toNonEmptyArray([1])).toEqual([1])
  })
})

describe('cloneObject', () => {
  it('shallow-clones objects and arrays', () => {
    const source = { a: 1, nested: { b: 2 } }
    const clone = cloneObject(source)

    expect(clone).toEqual(source)
    expect(clone).not.toBe(source)
    expect(clone.nested).toBe(source.nested)

    const rows = [{ a: 1 }]
    const clonedRows = cloneObject(rows)
    expect(clonedRows).toEqual(rows)
    expect(clonedRows).not.toBe(rows)
    expect(clonedRows[0]).not.toBe(rows[0])
  })
})

describe('syncData', () => {
  it('returns false for incompatible values', () => {
    expect(syncData(1, 2)).toBe(false)
    expect(syncData({ a: 1 }, null)).toBe(false)
  })

  it('returns true for identical references', () => {
    const target: Record<string, unknown> = { a: 1 }
    target.self = target
    expect(syncData(target, target)).toBe(true)
  })

  it('treats JSON-equal values as unchanged', () => {
    const target = { a: 1 }
    expect(syncData(target, { a: 1 })).toBe(true)
    expect(target).toEqual({ a: 1 })
  })

  it('patches objects in place', () => {
    const target = { a: 1, b: 2 }
    expect(syncData(target, { a: 1, b: 3 })).toBe(true)
    expect(target).toEqual({ a: 1, b: 3 })
  })

  it('removes object keys missing from changes', () => {
    const target = { a: 1, b: 2 }
    expect(syncData(target, { a: 1 })).toBe(true)
    expect(target).toEqual({ a: 1 })
  })

  it('patches arrays in place', () => {
    const target = [1, 2, 3]
    expect(syncData(target, [1, 4])).toBe(true)
    expect(target).toEqual([1, 4])
  })

  it('patches when JSON comparison throws', () => {
    const target: Record<string, unknown> = { a: 1n }
    const changes: Record<string, unknown> = { a: 1n }
    expect(syncData(target, changes)).toBe(true)
    expect(target).toEqual({ a: 1n })
  })
})
