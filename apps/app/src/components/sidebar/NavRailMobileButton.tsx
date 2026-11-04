import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Icon } from "@bb/shared-ui/icon";
import { BsLogo } from "@/components/ui/bs-logo";
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

export function NavRailMobileButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ConnectStatusSnapshot>({
    connected: false,
    remoteClients: 0,
  });

  // The official universal pairing URL that connects phone to b smart everywhere
  const pairingUrl = "https://b-smart-five.vercel.app";

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    QRCode.toDataURL(pairingUrl, {
      margin: 1,
      width: 260,
      color: {
        dark: "#0a0a0a",
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
  }, [open, pairingUrl]);

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
    navigator.clipboard.writeText(pairingUrl);
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
            aria-label="Connect Mobile (QR Code)"
            className={cn(
              SIDEBAR_RAIL_BUTTON_CLASS,
              "relative my-1 max-md:pointer-coarse:my-0",
              className,
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
            : "Connect Mobile with QR"}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-6 bg-surface border border-border rounded-3xl shadow-2xl text-center">
          <DialogHeader className="text-center pb-1">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              <BsLogo className="size-5" />
              <span>Connect with QR</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Scanni had l-QR code b l-portable bach t-connecta direct.
            </p>
          </DialogHeader>

          {/* Clean prominent QR Code */}
          <div className="flex flex-col items-center justify-center my-4">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR code to connect b smart mobile"
                  className="size-48 rounded-lg"
                />
              ) : (
                <div className="size-48 flex items-center justify-center text-xs text-slate-400">
                  Loading QR...
                </div>
              )}
            </div>

            {/* Live Connection Status */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border/70 bg-surface-recessed">
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
                    Waiting for scan...
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Copy Link */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs h-8 rounded-xl"
            onClick={handleCopy}
          >
            <Icon
              name={copied ? "Check" : "Copy"}
              className={cn("size-3.5", copied && "text-emerald-500")}
            />
            <span>{copied ? "Link Copied!" : "Copy Connection Link"}</span>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
