import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { HttpError } from "@/lib/http-error";
import type { Database } from "./types";

function validateOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Browsers always send Origin or Referer for cross-origin requests.
  // If both are absent, this is likely a direct API call (curl, fetch from server) — allow.
  if (!origin && !referer) return;

  const ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "breezkit.app",
    "breezkit.vercel.app",
    "breezkit.netlify.app",
  ];

  const source = origin ?? referer!;
  let hostname: string;
  try {
    hostname = new URL(source).hostname;
  } catch {
    throw new HttpError("Unauthorized: Invalid origin header", 403);
  }

  // Allow localhost in any port for development
  if (hostname === "localhost" || hostname === "127.0.0.1") return;

  const allowed = ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  if (!allowed) {
    throw new HttpError(`Unauthorized: Request origin not allowed (${hostname})`, 403);
  }
}

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Set them in your .env file.`;
      console.error(`[Supabase] ${message}`);
      throw new Error(message);
    }

    const request = getRequest();

    if (!request?.headers) {
      throw new HttpError("Unauthorized: No request headers available", 401);
    }

    validateOrigin(request);

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new HttpError("Unauthorized: No authorization header provided", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new HttpError("Unauthorized: Only Bearer tokens are supported", 401);
    }

    const token = authHeader.slice("Bearer ".length);
    if (!token) {
      throw new HttpError("Unauthorized: No token provided", 401);
    }

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new HttpError("Unauthorized: Invalid token", 401);
    }

    return next({
      context: {
        supabase,
        userId: data.user.id,
      },
    });
  },
);
