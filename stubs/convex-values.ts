// Demo-only stub for `convex/values`. Mirrors the shape of the real `v`
// validator namespace so files importing it keep type-checking.

const passthrough = <T>(value?: T) => value as T;

export const v = {
  string: () => passthrough<string>(),
  number: () => passthrough<number>(),
  boolean: () => passthrough<boolean>(),
  any: () => passthrough<unknown>(),
  optional: <T>(_inner: T) => passthrough<T | undefined>(),
  union: <T>(..._members: T[]) => passthrough<T>(),
  literal: <L extends string | number | boolean>(value: L) => value,
  array: <T>(_inner: T) => passthrough<T[]>(),
  id: <T extends string>(_table: T) => passthrough<string>(),
};
