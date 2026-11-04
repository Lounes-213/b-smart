import { createFileRoute } from "@tanstack/react-router";

const ANDROID_APK_URL =
  "https://github.com/Lounes-213/b-smart/releases/download/desktop-latest/b-smart.apk";

export const Route = createFileRoute("/download/android")({
  server: {
    handlers: {
      GET: () =>
        new Response(null, {
          status: 302,
          headers: {
            Location: ANDROID_APK_URL,
            "Cache-Control": "no-cache",
          },
        }),
    },
  },
});
