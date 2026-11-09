import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

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

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const CMS_URL = (
  (import.meta.env["VITE_CMS_URL"] as string | undefined) ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function cmsJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

type Sitemap = { urls: { path: string; updatedAt: string | null }[]; robots: string | null };
type RedirectRule = { from_path: string; to_path: string; status_code: number };

let redirectCache: { at: number; rules: RedirectRule[] } | undefined;

/** SEO endpoints and redirects managed in the CMS, answered before the app renders. */
async function handleSeoRoutes(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname === "/sitemap.xml") {
    const data = await cmsJson<Sitemap>("sitemap");
    const urls = (data?.urls ?? [{ path: "/", updatedAt: null }])
      .map(
        (u) =>
          `<url><loc>${url.origin}${u.path}</loc>${u.updatedAt ? `<lastmod>${u.updatedAt.slice(0, 10)}</lastmod>` : ""}</url>`,
      )
      .join("");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
      {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
  }
  if (url.pathname === "/robots.txt") {
    const data = await cmsJson<Sitemap>("sitemap");
    const body = `${(data?.robots ?? "User-agent: *\nAllow: /").trim()}\n\nSitemap: ${url.origin}/sitemap.xml\n`;
    return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  if (
    request.method === "GET" &&
    !url.pathname.startsWith("/_") &&
    !/\.[a-z0-9]+$/i.test(url.pathname)
  ) {
    // Redirect rules change rarely, so they are cached for a minute.
    if (!redirectCache || Date.now() - redirectCache.at > 60_000) {
      redirectCache = {
        at: Date.now(),
        rules: (await cmsJson<RedirectRule[]>("redirects")) ?? redirectCache?.rules ?? [],
      };
    }
    const path = url.pathname.replace(/\/$/, "") || "/";
    const rule = redirectCache.rules.find((r) => (r.from_path.replace(/\/$/, "") || "/") === path);
    if (rule)
      return Response.redirect(
        new URL(rule.to_path, url.origin).toString(),
        rule.status_code === 302 ? 302 : 301,
      );
  }
  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const seoResponse = await handleSeoRoutes(request);
      if (seoResponse) return seoResponse;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
