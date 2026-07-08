import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { HttpError } from "./http-error";
import { apiRateLimiter, extractClientIp } from "./rate-limiter.server";

export const rateLimitApi = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const request = getRequest();
  const ip = extractClientIp(request);
  const result = apiRateLimiter.check(ip);
  if (!result.allowed) {
    throw new HttpError("Demasiadas solicitudes. Intenta de nuevo en un minuto.", 429);
  }
  return next();
});
