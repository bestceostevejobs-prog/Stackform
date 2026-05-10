"use client";

// Demo-only stub for `convex/react`. Resolved via tsconfig paths so the real
// Convex client is never loaded. All mutations are no-ops.

export type FunctionReference = string;

export function useMutation(
  _ref: FunctionReference,
): (args?: Record<string, unknown>) => Promise<void> {
  return async (args?: Record<string, unknown>) => {
    if (typeof window !== "undefined") {
      console.debug("[stub] convex mutation", _ref, args);
    }
  };
}

export function useQuery<T = unknown>(
  _ref: FunctionReference,
  _args?: Record<string, unknown>,
): T | undefined {
  return undefined;
}
