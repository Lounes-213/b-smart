import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import {
  marketplaceHtmlCacheControl,
  marketplaceResponseStatus,
} from "./marketplace/marketplace-response-status.js";

const handler = createStartHandler(async (context) => {
  const pathname = new URL(context.request.url).pathname;
  const status = marketplaceResponseStatus(
    pathname,
    context.router.state.matches.map((match) => match.loaderData),
  );
  if (status !== null) {
    context.router.stores.statusCode.set(status);
  }
  const result = await defaultStreamHandler(context);
  const response = "response" in result ? result.response : result;
  const cacheControl = marketplaceHtmlCacheControl(pathname, response.status);
  if (cacheControl === null) return result;
  const headers = new Headers(response.headers);
  headers.set("cache-control", cacheControl);
  const updatedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
  return "response" in result
    ? { ...result, response: updatedResponse }
    : updatedResponse;
});

export default {
  fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    if (url.pathname === "/bs-mobile.apk") {
      return Response.redirect("https://github.com/Lounes-213/b-smart/releases/latest/download/bs-mobile.apk", 302);
    }
    if (url.pathname === "/b-smart.exe" || url.pathname === "/bs.exe" || url.pathname === "/b-smart-x64.exe") {
      return Response.redirect("https://github.com/Lounes-213/b-smart/releases/download/v0.48.2/b-smart-0.48.1-x64.exe", 302);
    }
    if (typeof globalThis !== "undefined" && env) {
      (globalThis as unknown as Record<string, unknown>).__CF_ENV__ = env;
    }
    return handler(request);
  },
};
