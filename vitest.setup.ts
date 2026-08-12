import "@testing-library/jest-dom/vitest";
import { TextDecoder, TextEncoder } from "node:util";

// jsdom installs its own realm's ExpressionObject typed-array constructors,
// which breaks esbuild's `TextEncoder().encode("") instanceof Uint8Array`
// identity check. Restore the Node realms for the codecs esbuild relies on.
if (typeof TextEncoder === "undefined" || !(new TextEncoder().encode("") instanceof Uint8Array)) {
  const probe = new TextEncoder().encode("");
  const NodeUint8Array = probe.constructor as Uint8ArrayConstructor;
  const NodeArrayBuffer = probe.buffer.constructor as ArrayBufferConstructor;

  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
  globalThis.Uint8Array = NodeUint8Array as typeof globalThis.Uint8Array;
  globalThis.ArrayBuffer = NodeArrayBuffer as typeof globalThis.ArrayBuffer;
}
