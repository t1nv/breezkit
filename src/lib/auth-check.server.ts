import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authRateLimiter, extractClientIp } from "./rate-limiter.server";

export const checkAuthRateLimit = createServerFn({ method: "POST" }).handler(async () => {
  const request = getRequest();
  const ip = extractClientIp(request);
  const result = authRateLimiter.check(ip);
  if (!result.allowed) {
    return { blocked: true, resetInMs: result.resetInMs };
  }
  return { blocked: false };
});
