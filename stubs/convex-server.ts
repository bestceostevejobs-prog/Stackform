// Demo-only stub for `convex/server`. The real Convex backend is not wired up
// for the standalone preview — these definitions just keep TypeScript happy
// for any file that imports from `convex/server`.

type Handler = (...args: never[]) => unknown;

export function defineSchema<T>(tables: T): T {
  return tables;
}

export function defineTable<T>(_validator: T): {
  index: (..._args: unknown[]) => unknown;
} {
  const builder = {
    index: (..._args: unknown[]) => builder,
  };
  return builder;
}

export function mutation<T extends { handler: Handler }>(def: T): T {
  return def;
}

export function query<T extends { handler: Handler }>(def: T): T {
  return def;
}
