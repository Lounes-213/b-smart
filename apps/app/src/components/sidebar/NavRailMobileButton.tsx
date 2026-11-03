import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Icon } from "@bb/shared-ui/icon";
import { Button } from "@bb/shared-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@bb/shared-ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@bb/shared-ui/tooltip";
import { cn } from "@bb/shared-ui/lib/utils";
import { SIDEBAR_RAIL_BUTTON_CLASS } from "@bb/shared-ui/sidebar-row-classes";
import { wsManager } from "@/lib/ws";

interface ConnectStatusSnapshot {
  connected: boolean;
  remoteClients: number;
}

export function NavRailMobileButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"remote" | "lan">("remote");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ConnectStatusSnapshot>({
    connected: false,
    remoteClients: 0,
  });

  const localIp = "192.168.1.72";
  const port = window.location.port || "38886";
  const lanUrl = `http://${localIp}:${port}`;
  const remoteUrl = "https://b-smart-five.vercel.app";
  const activeUrl = mode === "lan" ? lanUrl : remoteUrl;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    QRCode.toDataURL(activeUrl, {
      margin: 1,
      width: 280,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    }).then(
      (data) => {
        if (!cancelled) setQrDataUrl(data);
      },
      (err) => {
        console.error("Failed to generate QR code:", err);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [open, activeUrl]);

  useEffect(() => {
    const checkStatus = () => {
      const state = wsManager.getConnectionState();
      setStatus({
        connected: state === "connected",
        remoteClients: state === "connected" ? 1 : 0,
      });
    };

    checkStatus();
    const timer = setInterval(checkStatus, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMobileConnected = status.connected && status.remoteClients > 0;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Connect Mobile (b smart)"
            className={cn(
              SIDEBAR_RAIL_BUTTON_CLASS,
              "relative my-1 max-md:pointer-coarse:my-0",
            )}
            onClick={() => setOpen(true)}
          >
            <Icon name="Smartphone" className="size-5" aria-hidden="true" />
            {isMobileConnected && (
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isMobileConnected
            ? "b smart Mobile: Connected"
            : "Connect Mobile (b smart)"}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-6 bg-surface border border-border rounded-2xl shadow-2xl">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              <Icon name="Smartphone" className="size-6 text-primary" />
              <span>Connect b smart Mobile</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Scanni had l-QR code b l'application <strong>b smart</strong> bach t-connecta direct.
            </p>
          </DialogHeader>

          {/* Mode Switcher */}
          <div className="flex bg-surface-recessed p-1 rounded-xl gap-1 border border-border/50 text-xs">
            <button
              type="button"
              className={cn(
                "flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all",
                mode === "remote"
                  ? "bg-surface shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("remote")}
            >
              <Icon name="Globe" className="size-4" />
              <span>Remote (4G / Internet)</span>
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all",
                mode === "lan"
                  ? "bg-surface shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setMode("lan")}
            >
              <Icon name="Laptop" className="size-4" />
              <span>Same Wi-Fi (LAN)</span>
            </button>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="b smart mobile pairing QR code"
                  className="size-48 rounded-lg"
                />
              ) : (
                <div className="size-48 flex items-center justify-center text-xs text-slate-400">
                  Generating QR code...
                </div>
              )}
            </div>

            {/* Live Connection Status Banner */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-surface-recessed">
              {isMobileConnected ? (
                <>
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Phone Connected
                  </span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-muted-foreground">
                    Waiting for mobile phone to scan...
                  </span>
                </>
              )}
            </div>
          </div>

          {/* URL & Copy Row */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-recessed border border-border text-xs">
            <span className="truncate flex-1 font-mono text-muted-foreground select-all px-1">
              {activeUrl}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 gap-1 shrink-0 text-xs"
              onClick={handleCopy}
            >
              <Icon
                name={copied ? "Check" : "Copy"}
                className={cn("size-3.5", copied && "text-emerald-500")}
              />
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
