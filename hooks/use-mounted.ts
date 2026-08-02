"use client";

import * as React from "react";

const emptySubscribe = () => () => {};

/** Returns true once hydrated on the client (hydration-safe). */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
