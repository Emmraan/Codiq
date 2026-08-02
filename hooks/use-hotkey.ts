"use client";

import * as React from "react";

/**
 * Registers a global keyboard shortcut. Calls the handler when `metaKey` (or
 * `ctrlKey` on non-mac) is held together with `key`.
 */
export function useHotkey(key: string, onTrigger: () => void, enabled = true): void {
  const handlerRef = React.useRef(onTrigger);

  React.useEffect(() => {
    handlerRef.current = onTrigger;
  }, [onTrigger]);

  React.useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase() && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        handlerRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, enabled]);
}
