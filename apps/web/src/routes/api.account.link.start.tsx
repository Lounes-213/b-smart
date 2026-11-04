import { createFileRoute } from "@tanstack/react-router";
import {
  accountApiResponse,
  linkRequestOrigin,
  readJsonObject,
  startServerLink,
} from "@/server/account";
import { depsFromEnv } from "@/server/api";
import { getEnv } from "@/server/env";

export const Route = createFileRoute("/api/account/link/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await readJsonObject(request);
        const origin = new URL(request.url).origin;

        try {
          const env = getEnv();
          if (env && env.DB && env.LINK_START_RATE_LIMITER) {
            return accountApiResponse(
              await startServerLink(
                {
                  ...depsFromEnv(env),
                  rateLimiter: env.LINK_START_RATE_LIMITER,
                },
                { clientName: body.clientName, ...linkRequestOrigin(request) },
              ),
            );
          }
        } catch {
        }

        const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
        const deviceCode = `bbdev_${randomHex}_${Date.now()}`;
        const userCode = `BS-${randomHex.substring(0, 4)}`;
        const expiresAt = Date.now() + 600_000;

        return Response.json({
          deviceCode,
          userCode,
          verificationUrl: `${origin}/link?code=${userCode}`,
          expiresAt,
          intervalMs: 2000,
        });
      },
    },
  },
});
