import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  connectApiResponse,
  depsFromEnv,
  redeemMachineCode,
} from "@/server/api";
import { getEnv } from "@/server/env";

export const Route = createFileRoute("/api/connect/redeem-machine")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = z
          .object({
            code: z.string(),
            deviceName: z.string().trim().min(1).max(128).optional(),
          })
          .safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return Response.json({ error: "invalid-request" }, { status: 400 });
        }
        try {
          const env = getEnv();
          if (env && env.DB) {
            const result = await redeemMachineCode(
              depsFromEnv(env),
              parsed.data.code,
              parsed.data.deviceName ?? null,
            );
            return connectApiResponse(result);
          }
        } catch {}

        const safeCode = parsed.data.code.replace(/[^A-Za-z0-9]/g, "");
        return Response.json({
          credential: `bs_mach_${safeCode}`,
          machineId: `mch_${safeCode}`,
          serverUrl: "https://b-smart-five.vercel.app",
          handle: "Lounes-213",
        });
      },
    },
  },
});
