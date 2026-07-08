import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  generateCspNonce,
  getSecurityHeaders,
  injectCspNonceIntoHtml,
} from "./lib/security-headers";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function addSecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  const contentType = response.headers.get("content-type") ?? "text/html; charset=utf-8";
  const isHtml = contentType.includes("text/html");

  const body: BodyInit | null | undefined = response.body;

  if (isProduction() && isHtml) {
    const nonce = generateCspNonce();
    const modifiedHeaders = getSecurityHeaders(contentType, nonce);

    for (const [key, value] of Object.entries(modifiedHeaders)) {
      if (!newHeaders.has(key)) {
        newHeaders.set(key, value);
      }
    }

    if (!newHeaders.has("cache-control")) {
      newHeaders.set("cache-control", "no-cache, no-store, must-revalidate");
    }

    return new Response(
      new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let done = false;
          const chunks: string[] = [];

          while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            if (value) chunks.push(decoder.decode(value, { stream: !done }));
          }

          const fullHtml = chunks.join("");
          const patched = injectCspNonceIntoHtml(fullHtml, nonce);
          controller.enqueue(encoder.encode(patched));
          controller.close();
        },
      }),
      {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      },
    );
  }

  const headers = getSecurityHeaders(contentType);
  for (const [key, value] of Object.entries(headers)) {
    if (!newHeaders.has(key)) {
      newHeaders.set(key, value);
    }
  }
  if (!newHeaders.has("cache-control")) {
    newHeaders.set("cache-control", "no-cache, no-store, must-revalidate");
  }
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  const withHeaders = addSecurityHeaders(response);
  if (withHeaders.status < 500) return withHeaders;
  const contentType = withHeaders.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return withHeaders;

  const body = await withHeaders.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return withHeaders;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  const nonce = isProduction() ? generateCspNonce() : undefined;
  return new Response(renderErrorPage(nonce), {
    status: 500,
    headers: getSecurityHeaders("text/html; charset=utf-8", nonce),
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      const nonce = isProduction() ? generateCspNonce() : undefined;
      return new Response(renderErrorPage(nonce), {
        status: 500,
        headers: getSecurityHeaders("text/html; charset=utf-8", nonce),
      });
    }
  },
};
