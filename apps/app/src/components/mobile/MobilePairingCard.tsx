import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@bb/shared-ui/button";
import { Icon } from "@bb/shared-ui/icon";
import { cn } from "@bb/shared-ui/lib/utils";
import {
  buildLocalMobilePairing,
  encodeLocalMobilePairing,
  isPairingExpired,
  resolvePairingServerUrl,
} from "@/lib/mobile-pairing";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isLoopback(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "[::1]"
    );
  } catch {
    return false;
  }
}

export function MobilePairingCard({
  className,
  machineServerUrl,
  origin,
  defaultServerUrl,
}: {
  className?: string;
  machineServerUrl?: string | null;
  origin?: string | null;
  defaultServerUrl?: string | null;
}) {
  const serverUrl = resolvePairingServerUrl({
    machineServerUrl: machineServerUrl ?? defaultServerUrl,
    origin:
      origin ?? (typeof window === "undefined" ? null : window.location.origin),
  });
  const [payload, setPayload] = useState(() =>
    buildLocalMobilePairing({ serverUrl }),
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const qrText = useMemo(() => encodeLocalMobilePairing(payload), [payload]);
  const expired = isPairingExpired(payload, now);

  const renew = useCallback(() => {
    setPayload(buildLocalMobilePairing({ serverUrl }));
    setNow(Date.now());
  }, [serverUrl]);

  useEffect(() => {
    renew();
  }, [renew]);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(qrText, {
      margin: 1,
      width: 280,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).then(
      (data) => {
        if (!cancelled) setQrDataUrl(data);
      },
      () => undefined,
    );
    return () => {
      cancelled = true;
    };
  }, [qrText]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!expired) return;
    renew();
  }, [expired, renew]);

  const copyLink = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [serverUrl]);

  const loopback = isLoopback(serverUrl);

  return (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
    >
      <div className="rounded-2xl border border-border bg-white p-3 shadow-md">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR code to pair the bs mobile app"
            className={cn(
              "size-44 rounded-lg transition-opacity",
              expired && "opacity-30",
            )}
          />
        ) : (
          <div className="flex size-44 items-center justify-center text-xs text-slate-400">
            Preparing QR…
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border/70 bg-surface-recessed px-3 py-1.5 text-xs font-medium">
        <span
          className={cn(
            "size-2 rounded-full",
            expired ? "bg-amber-400" : "bg-emerald-500 animate-pulse",
          )}
        />
        <span className="text-muted-foreground">
          {expired
            ? "Refreshing code…"
            : `Ready to scan · expires in ${formatRemaining(payload.expiresAt - now)}`}
        </span>
      </div>

      <div className="w-full space-y-1">
        <p className="text-xs text-muted-foreground">
          Open the <strong>bs</strong> phone app, tap the scanner, and point it
          at this code. You enter the workspace instantly.
        </p>
        <p className="break-all font-mono text-[11px] text-subtle-foreground">
          {payload.code} · {serverUrl}
        </p>
      </div>

      {loopback && (
        <p
          role="alert"
          className="w-full rounded-xl border border-amber-500/25 bg-amber-500/10 p-2.5 text-left text-[11px] text-amber-700 dark:text-amber-400"
        >
          This bs is reachable at localhost only, so the phone cannot open it.
          Configure a LAN or public address under Settings → Mobile, then scan
          again.
        </p>
      )}

      <div className="flex w-full flex-col gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 rounded-xl text-xs"
          onClick={renew}
        >
          <Icon name="RotateCcw" className="size-3.5" />
          <span>Generate a new code</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full gap-2 rounded-xl text-xs text-muted-foreground"
          onClick={copyLink}
        >
          <Icon name={copied ? "Check" : "Copy"} className="size-3.5" />
          <span>{copied ? "Address copied" : "Copy server address"}</span>
        </Button>
      </div>
    </div>
  );
}
