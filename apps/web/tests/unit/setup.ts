import { afterEach, vi } from "vitest";

const originalEnv = { ...process.env };
const originalDescriptors = {
  fetch: Object.getOwnPropertyDescriptor(globalThis, "fetch"),
  window: Object.getOwnPropertyDescriptor(globalThis, "window"),
  navigator: Object.getOwnPropertyDescriptor(globalThis, "navigator"),
  RTCPeerConnection: Object.getOwnPropertyDescriptor(globalThis, "RTCPeerConnection"),
  WebSocket: Object.getOwnPropertyDescriptor(globalThis, "WebSocket"),
};

function restoreProperty(name: keyof typeof originalDescriptors) {
  const descriptor = originalDescriptors[name];
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
    return;
  }

  delete (globalThis as Record<string, unknown>)[name];
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  process.env = { ...originalEnv };
  restoreProperty("fetch");
  restoreProperty("window");
  restoreProperty("navigator");
  restoreProperty("RTCPeerConnection");
  restoreProperty("WebSocket");
});
