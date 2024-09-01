// src/lib/utils/deepClone.ts

/**
 * Utility for performing a deep clone of plain data structures.
 *
 * Supported types:
 * - Primitives (returned as-is)
 * - Arrays
 * - Plain objects (Object prototype)
 * - Date
 * - RegExp
 * - Map
 * - Set
 *
 * Circular references are handled via a WeakMap cache.
 * The goal is to be predictable and safe for typical algorithm inputs,
 * not to perfectly clone every exotic JavaScript feature.
 */

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Narrowing helper to detect plain objects. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Deep clone implementation.
 *
 * @param value The value to clone.
 * @param cache Internal WeakMap used to preserve object identity and
 *              handle circular references.
 */
export function deepClone<T>(value: T, cache = new WeakMap<object, any>()): T {
  // Primitives are returned as-is.
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return value;
  }

  // Cached?
  if (cache.has(value as object)) {
    return cache.get(value as object);
  }

  // Date
  if (value instanceof Date) {
    const result = new Date(value.getTime()) as unknown as T;
    cache.set(value as object, result);
    return result;
  }

  // RegExp
  if (value instanceof RegExp) {
    const result = new RegExp(value.source, value.flags) as unknown as T;
    cache.set(value as object, result);
    return result;
  }

  // Array
  if (Array.isArray(value)) {
    const arr: unknown[] = [];
    cache.set(value as object, arr);
    for (const item of value) {
      arr.push(deepClone(item as any, cache));
    }
    return arr as unknown as T;
  }

  // Map
  if (value instanceof Map) {
    const clonedMap = new Map<any, any>();
    cache.set(value as object, clonedMap);
    for (const [k, v] of value.entries()) {
      const clonedKey = deepClone(k as any, cache);
      const clonedVal = deepClone(v as any, cache);
      clonedMap.set(clonedKey, clonedVal);
    }
    return clonedMap as unknown as T;
  }

  // Set
  if (value instanceof Set) {
    const clonedSet = new Set<any>();
    cache.set(value as object, clonedSet);
    for (const item of value.values()) {
      clonedSet.add(deepClone(item as any, cache));
    }
    return clonedSet as unknown as T;
  }

  // Plain object
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    cache.set(value as object, result);
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = deepClone(val as any, cache);
    }
    return result as unknown as T;
  }

  // Fallback: for class instances or anything else, we create a shallow clone.
  // This avoids accidentally breaking invariants for complex framework objects.
  const proto = Object.getPrototypeOf(value);
  const cloneObj = Object.create(proto);
  cache.set(value as object, cloneObj);

  for (const key of Reflect.ownKeys(value as object)) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if (!desc) continue;
    if ("value" in desc) {
      desc.value = deepClone(desc.value as any, cache);
    }
    Object.defineProperty(cloneObj, key, desc);
  }

  return cloneObj as T;
}

/**
 * Convenience helper for cloning arrays of items.
 */
export function deepCloneArray<T>(items: T[]): T[] {
  return deepClone(items);
}

/**
 * Shallow comparison utility often used together with deepClone
 * in tests and examples.
 */
export function shallowEqual<T extends Record<string, any>>(
  a: T | null | undefined,
  b: T | null | undefined
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}
