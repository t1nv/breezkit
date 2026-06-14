import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { generateCspNonce, getSecurityHeaders } from "./lib/security-headers";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      const status = (error as { statusCode: number }).statusCode;
      const body = status === 401 ? "Unauthorized" : "Error";
      return new Response(body, {
        status,
        headers: getSecurityHeaders("text/plain; charset=utf-8"),
      });
    }
    console.error(error);
    const nonce = process.env.NODE_ENV === "production" ? generateCspNonce() : undefined;
    return new Response(renderErrorPage(nonce), {
      status: 500,
      headers: getSecurityHeaders("text/html; charset=utf-8", nonce),
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
