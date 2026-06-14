import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { apiRateLimiter, extractClientIp } from "./rate-limiter.server";

export const rateLimitApi = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const ip = extractClientIp(request);
    const result = apiRateLimiter.check(ip);
    if (!result.allowed) {
      const err = new Error("Demasiadas solicitudes. Intenta de nuevo en un minuto.");
      (err as any).statusCode = 429;
      throw err;
    }
    return next();
  },
);
