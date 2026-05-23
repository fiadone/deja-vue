import type { NonEmptyArray } from '../types'

export * from './timeline'

export function cloneObject<T extends object> (target: T): T {
  return (
    Array.isArray(target)
      ? target.map(target => ({ ...target }))
      : { ...target }
  ) as T
}

export function isObject (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function patch (target: unknown, change: unknown): boolean {
  if (JSON.stringify(target) === JSON.stringify(change)) return true

  if (isObject(change) && isObject(target)) {
    patchObject(target, change)
    return true
  }

  if (Array.isArray(change) && Array.isArray(target)) {
    patchArray(target, change)
    return true
  }

  return false
}

export function patchArray (target: unknown[], changes: unknown[]) {
  for (let i = 0; i < changes.length; i++) {
    if (!patch(target[i], changes[i])) {
      target[i] = changes[i]
    }
  }

  target.length = changes.length
}

export function patchObject <T extends object> (target: T, changes: T) {
  for (const key in changes) {
    if (!patch(target[key], changes[key])) {
      target[key] = changes[key]
    }
  }

  for (const key in target) {
    if (!(key in changes)) {
      delete target[key]
    }
  }
}

export function toNonEmptyArray<T = unknown> (data: T[]): NonEmptyArray<T> | null {
  return data.length ? data as NonEmptyArray<T> : null
}
