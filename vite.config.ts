// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // Keep client, SSR, lazy 3D chunks, and preview instrumentation on one React instance.
    // This explicit guard prevents Vite's incremental optimizer from creating a stale
    // second React prebundle after dependency or route hot updates.
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      // Pre-bundle every client dependency up front so Vite never re-optimizes mid-session
      // (a late re-optimization serves a new React chunk next to the old one → null dispatcher).
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "motion/react",
        "@radix-ui/react-accordion",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "lucide-react",
        "tailwind-merge",
        "zod",
      ],
    },
  },
  // The site is self-hosted (no longer on Lovable/Cloudflare), so build a standalone Node server.
  // Run it with `npm start` after `npm run build`.
  nitro: { preset: "node-server" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
