import { defineConfig, loadEnv, type UserConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Load ALL vars from .env (not just VITE_*) into process.env so server functions
// (AI provider, Supabase service role, etc.) can read them under `vite dev`.
// The prefix "" means: include every key. Vite only injects VITE_* into the client
// bundle, so non-VITE secrets stay server-side. In production these come from the host's env.
const mode = process.env.NODE_ENV || "development";
const env = loadEnv(mode, process.cwd(), "");
for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

export default defineConfig(({ command, mode }) => {
  const isDevBuild = command === "build" && mode === "development";

  const config: UserConfig = {
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Fail the build if client code reaches into server modules.
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
        server: { entry: "server" },
      }),
      // The nitro plugin only participates in builds; dev SSR is handled by tanstackStart.
      ...(command === "build" ? [nitro({ preset: "node-server" })] : []),
      viteReact(),
    ],
    server: {
      port: 8080,
    },
    // Match the build's CSS pipeline in dev. Vite uses PostCSS in dev and only runs
    // Lightning CSS at build, so build-time transforms (e.g. collapsing a hand-written
    // `-webkit-backdrop-filter` to the prefixed form Chrome ignores) break the
    // built/static output while the dev preview looks fine. Running Lightning CSS in
    // both keeps the preview honest.
    css: { transformer: "lightningcss" },
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    // Dep re-optimization rotates the optimized-dep hash and 504s tabs holding the
    // old one; pre-bundle the always-present client deps + tolerate stale requests.
    // React core only — including @tanstack/react-start would pull its
    // node:async_hooks server entry into the client bundle and crash hydration.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
  };

  // Client-scoped so React DevTools gets the dev react-dom on `build:dev`; a global
  // NODE_ENV flip would emit jsxDEV, which the react-server SSR runtime can't resolve.
  if (isDevBuild) {
    config.environments = {
      client: {
        define: { "process.env.NODE_ENV": JSON.stringify("development") },
      },
    };
  }

  return config;
});
