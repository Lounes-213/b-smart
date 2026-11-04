import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { Icon } from "@bb/shared-ui/icon";
import { BsLogo } from "@/components/ui/bs-logo";
import { Button } from "@bb/shared-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@bb/shared-ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@bb/shared-ui/tooltip";
import { cn } from "@bb/shared-ui/lib/utils";
import { SIDEBAR_RAIL_BUTTON_CLASS } from "@bb/shared-ui/sidebar-row-classes";
import { useBsAccount } from "@/lib/bs-account";

export function NavRailMobileButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { account, setMobileConnected } = useBsAccount();

  const isMobileConnected = Boolean(account.mobileConnected);
  const userCode = account.username ? account.username.replace(/[^A-Za-z0-9]/g, "").toUpperCase() : "CONNECT";
  const pairingUrl = `https://b-smart-five.vercel.app/?code=BS-${userCode}&serverUrl=https://b-smart-five.vercel.app`;

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
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [open, pairingUrl]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(pairingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenSettings = () => {
    setOpen(false);
    navigate("/settings/mobile");
  };

  const handlePairNow = () => {
    setMobileConnected(true, "Mobile Companion");
  };

  const handleDisconnectMobile = () => {
    setMobileConnected(false);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isMobileConnected
                ? `b smart Mobile: Connected (@${account.username || "User"})`
                : "Connect Mobile (QR Code)"
            }
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
            ? `b smart Mobile: Connected (@${account.username || "User"})`
            : "Connect Mobile with QR"}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-5 bg-surface border border-border rounded-3xl shadow-2xl text-center">
          <DialogHeader className="text-center pb-1">
            <DialogTitle className="text-base font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              <BsLogo className="size-5" />
              <span>{isMobileConnected ? "Mobile Connected" : "Connect Mobile with QR"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {isMobileConnected
                ? `Your phone is paired and connected to @${account.username || "b smart"}.`
                : "Scan this QR code with the b smart mobile app to link your phone."}
            </DialogDescription>
          </DialogHeader>

          {isMobileConnected ? (
            <div className="space-y-4 my-2">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Icon name="Smartphone" className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {account.mobileDeviceName || "Mobile Companion"}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live & Connected
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-8.5 rounded-xl"
                  onClick={handleOpenSettings}
                >
                  <Icon name="Settings" className="size-3.5" />
                  <span>Open Mobile Settings</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-8.5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                  onClick={handleDisconnectMobile}
                >
                  <Icon name="CircleX" className="size-3.5" />
                  <span>Disconnect Phone</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 my-2">
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR code to connect b smart mobile"
                      className="size-44 rounded-lg"
                    />
                  ) : (
                    <div className="size-44 flex items-center justify-center text-xs text-slate-400">
                      Loading QR…
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-border/70 bg-surface-recessed">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-muted-foreground">Waiting for phone scan…</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1 text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-8.5 rounded-xl"
                  onClick={handleCopy}
                >
                  <Icon
                    name={copied ? "Check" : "Copy"}
                    className={cn("size-3.5", copied && "text-emerald-500")}
                  />
                  <span>{copied ? "Link Copied!" : "Copy Connection Link"}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-8.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                  onClick={handlePairNow}
                >
                  <Icon name="Zap" className="size-3.5" />
                  <span>Pair Phone Now (Instant)</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-xs h-8 text-muted-foreground hover:text-foreground"
                  onClick={handleOpenSettings}
                >
                  <Icon name="Settings" className="size-3.5" />
                  <span>Go to Mobile Settings</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
