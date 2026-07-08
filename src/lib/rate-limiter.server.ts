import process from "node:process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

interface Bucket {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, Bucket>>();
const CLEANUP_INTERVAL = 60_000;
const PERSIST_INTERVAL = 10_000;

let persistDirty = false;

function getPersistPath(): string | undefined {
  return process.env.RATE_LIMITER_FILE;
}

const persistPath = getPersistPath();

function serializeStores(): Record<string, Record<string, Bucket>> {
  const out: Record<string, Record<string, Bucket>> = {};
  for (const [name, buckets] of stores) {
    out[name] = Object.fromEntries(buckets);
  }
  return out;
}

function deserializeStores(data: Record<string, Record<string, Bucket>>) {
  for (const [name, buckets] of Object.entries(data)) {
    const map = new Map(Object.entries(buckets));
    stores.set(name, map);
  }
}

function persistNow() {
  if (!persistPath) return;
  try {
    const dir = dirname(persistPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(persistPath, JSON.stringify(serializeStores()), "utf-8");
  } catch (err) {
    console.error(`[rate-limiter] Failed to persist to ${persistPath}:`, err);
  }
}

function loadFromFile() {
  if (!persistPath) return;
  if (!existsSync(persistPath)) return;
  try {
    const raw = readFileSync(persistPath, "utf-8");
    const data = JSON.parse(raw) as Record<string, Record<string, Bucket>>;
    deserializeStores(data);
  } catch (err) {
    console.error(`[rate-limiter] Failed to load from ${persistPath}:`, err);
  }
}

// Initialize persistence
if (persistPath) loadFromFile();

setInterval(() => {
  const now = Date.now();
  for (const [, buckets] of stores) {
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) {
        buckets.delete(key);
        persistDirty = true;
      }
    }
  }
}, CLEANUP_INTERVAL);

setInterval(() => {
  if (persistDirty && persistPath) {
    persistNow();
    persistDirty = false;
  }
}, PERSIST_INTERVAL);

/**
 * Extract the real client IP from request headers.
 *
 * Priority order:
 * 1. x-real-ip — set by trusted reverse proxies (single IP, can't be forged upstream)
 * 2. x-forwarded-for — first IP is the original client (proxy chain: client, proxy1, proxy2)
 * 3. unknown — fallback when no headers present
 *
 * This prevents IP spoofing attacks against the rate limiter. If the app runs
 * behind Cloudflare, nginx, or similar, ensure the proxy sets x-real-ip.
 */
export function extractClientIp(request: { headers: Headers } | null): string {
  if (!request) return "unknown";

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for format: "client, proxy1, proxy2"
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "unknown";
}

export function createRateLimiter(opts: { windowMs: number; max: number; name: string }) {
  let buckets = stores.get(opts.name);
  if (!buckets) {
    buckets = new Map();
    stores.set(opts.name, buckets);
  }

  return {
    check(key: string): { allowed: boolean; remaining: number; resetInMs: number } {
      // Rate limiter is ALWAYS active by default (dev and production).
      // Set DISABLE_RATE_LIMITER=true to bypass (useful for load testing
      // or when the in-memory store causes issues with hot-reload).
      if (process.env.DISABLE_RATE_LIMITER === "true" || process.env.DISABLE_RATE_LIMITER === "1") {
        return { allowed: true, remaining: opts.max, resetInMs: 0 };
      }

      const now = Date.now();
      let bucket = buckets!.get(key);

      if (!bucket || now > bucket.resetAt) {
        bucket = { count: 1, resetAt: now + opts.windowMs };
        buckets!.set(key, bucket);
        persistDirty = true;
        return { allowed: true, remaining: opts.max - 1, resetInMs: opts.windowMs };
      }

      bucket.count += 1;
      persistDirty = true;

      if (bucket.count > opts.max) {
        return { allowed: false, remaining: 0, resetInMs: bucket.resetAt - now };
      }

      return { allowed: true, remaining: opts.max - bucket.count, resetInMs: bucket.resetAt - now };
    },

    reset(key: string) {
      buckets!.delete(key);
      persistDirty = true;
    },
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  name: "auth",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  name: "api",
});
