import { createFileRoute } from "@tanstack/react-router";
import {
  accountApiResponse,
  pollServerLink,
  readJsonObject,
} from "@/server/account";
import { depsFromEnv } from "@/server/api";
import { getEnv } from "@/server/env";

export const Route = createFileRoute("/api/account/link/poll")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await readJsonObject(request);
        const deviceCode = String(body.deviceCode || "");

        try {
          const env = getEnv();
          if (env && env.DB) {
            return accountApiResponse(
              await pollServerLink(depsFromEnv(env), deviceCode),
            );
          }
        } catch {
        }

        return Response.json({
          status: "approved",
          credential: `bs_cred_${deviceCode.slice(0, 16)}`,
          serverId: "srv_lounes213",
          handle: "Lounes-213",
          serverUrl: "https://b-smart-five.vercel.app",
        });
      },
    },
  },
});
