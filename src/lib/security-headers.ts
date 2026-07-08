/**
 * Resolve the Supabase origins for CSP from the environment at request time.
 * No project ref is hardcoded here — set SUPABASE_URL (or VITE_SUPABASE_URL).
 * When unset, fall back to the *.supabase.co wildcard so the app still works.
 */
function getSupabaseOrigins(): { https: string; wss: string } {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (url) {
    try {
      const host = new URL(url).host;
      return { https: `https://${host}`, wss: `wss://${host}` };
    } catch {
      // fall through to wildcard
    }
  }
  return { https: "https://*.supabase.co", wss: "wss://*.supabase.co" };
}

/**
 * Generate a CSP nonce using the Web Crypto API.
 * Works in Node.js 19+, Deno, Bun, and Cloudflare Workers — no `node:crypto` import needed.
 */
export function generateCspNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Build the Content-Security-Policy header value.
 *
 * In production (when `nonce` is provided), `script-src` uses the nonce-based
 * approach with `'strict-dynamic'` instead of `'unsafe-inline'` and also drops
 * `'unsafe-eval'` since the production bundle does not require it.
 *
 * In development (no nonce), fall back to `'unsafe-inline' 'unsafe-eval'` which
 * Vite / TanStack Start require for HMR and dynamic imports.
 *
 * `style-src` retains `'unsafe-inline'` in all modes because Tailwind CSS v4
 * generates inline style hashes at build time that would need a separate
 * hash-based policy. This is a low-risk allowance (style injection cannot
 * leak data or execute code). Google Fonts is allowed in `style-src`/`font-src`
 * because the app loads its display faces from there.
 */
function buildCsp(nonce?: string): string {
  const isProduction = nonce !== undefined;
  const supabase = getSupabaseOrigins();

  const scriptSrc = isProduction
    ? `'nonce-${nonce}' 'strict-dynamic'`
    : "'unsafe-inline' 'unsafe-eval'";

  const directives = [
    "default-src 'self'",
    `script-src 'self' ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `img-src 'self' data: blob: ${supabase.https}`,
    "font-src 'self' https://fonts.gstatic.com data:",
    `connect-src 'self' ${supabase.https} ${supabase.wss}`,
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

export const getSecurityHeaders = (contentType = "text/html; charset=utf-8", nonce?: string) => ({
  "content-type": contentType,
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "x-dns-prefetch-control": "off",
  "x-permitted-cross-domain-policies": "none",
  "content-security-policy": buildCsp(nonce),
});

/**
 * Inject a CSP nonce into all `<script>` tags in an HTML string.
 *
 * Only tags that do NOT already have a `nonce` or `src` attribute get the
 * nonce added. External scripts (`src="..."`) are covered by `'strict-dynamic'`
 * which propagates trust from the main nonced script.
 */
export function injectCspNonceIntoHtml(html: string, nonce: string): string {
  return html.replace(
    /<script(?![^>]*\b(?:src|nonce)=)([^>]*)>/gi,
    (_match, attrs: string) => `<script${attrs} nonce="${nonce}">`,
  );
}
