import type { NonEmptyArray } from '../types'


export function cloneObject<T extends object> (target: T): T {
  return (
    Array.isArray(target)
      ? target.map(target => ({ ...target }))
      : { ...target }
  ) as T
}

export function patchObject <T extends object> (target: T, changes: T) {
  for (const key in changes) {
    if (target[key] !== changes[key]) {
      target[key] = changes[key]
    }
  }

  for (const key in target) {
    if (!(key in changes)) {
      delete target[key]
    }
  }
}

export function toNonEmptyArray<T = any> (data: T[]): NonEmptyArray<T> | null {
  return data.length ? data as NonEmptyArray<T> : null
}
