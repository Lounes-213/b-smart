export interface LocalMobilePairingPayload {
  code: string;
  serverUrl: string;
  apex: string;
  expiresAt: number;
}

export const LOCAL_PAIRING_TTL_MS = 10 * 60_000;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChunk(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  let out = "";
  for (const byte of bytes) out += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  return out;
}

export function createPairingCode(): string {
  return `BS-${randomChunk(4)}-${randomChunk(4)}`;
}

export function normalizePairingServerUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolvePairingServerUrl(args: {
  machineServerUrl?: string | null;
  origin?: string | null;
}): string {
  const machine = normalizePairingServerUrl(args.machineServerUrl);
  if (machine && !machine.includes("localhost") && !machine.includes("127.0.0.1")) {
    return machine;
  }
  const orig = normalizePairingServerUrl(args.origin);
  if (orig && !orig.includes("localhost") && !orig.includes("127.0.0.1")) {
    return orig;
  }
  return "https://b-smart-five.vercel.app";
}

export function buildLocalMobilePairing(args: {
  serverUrl: string;
  now?: number;
  ttlMs?: number;
}): LocalMobilePairingPayload {
  const now = args.now ?? Date.now();
  const rawUrl = normalizePairingServerUrl(args.serverUrl);
  const serverUrl =
    rawUrl && !rawUrl.includes("localhost") && !rawUrl.includes("127.0.0.1")
      ? rawUrl
      : "https://b-smart-five.vercel.app";
  return {
    code: createPairingCode(),
    serverUrl,
    apex: "https://b-smart-five.vercel.app",
    expiresAt: now + (args.ttlMs ?? LOCAL_PAIRING_TTL_MS),
  };
}

export function encodeLocalMobilePairing(
  payload: LocalMobilePairingPayload,
): string {
  return JSON.stringify({
    code: payload.code,
    serverUrl: payload.serverUrl,
    apex: payload.apex,
    expiresAt: payload.expiresAt,
  });
}

export function isPairingExpired(
  payload: Pick<LocalMobilePairingPayload, "expiresAt">,
  now = Date.now(),
): boolean {
  return payload.expiresAt <= now;
}
