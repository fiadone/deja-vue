import type { NonEmptyArray } from '../types'

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

export function patchArray (target: unknown[], changes: unknown[]) {
  for (let i = 0; i < changes.length; i++) {
    if (!syncData(target[i], changes[i])) {
      target[i] = changes[i]
    }
  }

  target.length = changes.length
}

export function patchObject <T extends object> (target: T, changes: T) {
  for (const key in changes) {
    if (!syncData(target[key], changes[key])) {
      target[key] = changes[key]
    }
  }

  for (const key in target) {
    if (!(key in changes)) {
      delete target[key]
    }
  }
}

export function syncData (target: unknown, changes: unknown): boolean {
  if (Object.is(target, changes)) return true
  if (!isObject(target) && !Array.isArray(target)) return false

  try {
    // try string-based comparison first (it will fail if circular references are met)
    if (JSON.stringify(target) === JSON.stringify(changes)) return true
  } catch {
    // JSON.stringify failed (e.g. circular structures); fall through to structural patching
  }

  if (isObject(changes) && isObject(target)) {
    patchObject(target, changes)
    return true
  }

  if (Array.isArray(changes) && Array.isArray(target)) {
    patchArray(target, changes)
    return true
  }

  return false
}

export function toNonEmptyArray<T = unknown> (data: T[]): NonEmptyArray<T> | null {
  return data.length ? data as NonEmptyArray<T> : null
}
