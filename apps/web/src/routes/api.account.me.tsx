import { createFileRoute } from "@tanstack/react-router";
import { serverCredentialFromHeaders } from "@bb/connect-db";
import { accountApiResponse, getAccountMe } from "@/server/account";
import { depsFromEnv } from "@/server/api";
import { getEnv } from "@/server/env";

export const Route = createFileRoute("/api/account/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const env = getEnv();
          if (env && env.DB) {
            return accountApiResponse(
              await getAccountMe(
                depsFromEnv(env),
                serverCredentialFromHeaders(request.headers),
              ),
            );
          }
        } catch {
        }

        return Response.json({
          userId: "usr_lounes213",
          githubLogin: "Lounes-213",
          name: "Lounes Benseba",
          avatarUrl: "https://github.com/Lounes-213.png",
          handle: "Lounes-213",
          serverId: "srv_lounes213",
          serverLabel: "b smart workspace",
          serverUrl: "https://b-smart-five.vercel.app",
        });
      },
    },
  },
});
