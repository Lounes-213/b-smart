import { useState } from "react";
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
import { MobilePairingCard } from "@/components/mobile/MobilePairingCard";
import { useSystemConfig } from "@/hooks/queries/system-queries";

export function NavRailMobileButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const systemConfig = useSystemConfig();
  const machineServerUrl =
    systemConfig.data?.generalSettings?.machineServerUrl ?? null;

  const handleOpenSettings = () => {
    setOpen(false);
    navigate("/settings/mobile");
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Connect your phone with a QR code"
            className={cn(
              SIDEBAR_RAIL_BUTTON_CLASS,
              "relative my-1 max-md:pointer-coarse:my-0",
              className,
            )}
            onClick={() => setOpen(true)}
          >
            <Icon name="Smartphone" className="size-5" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Connect your phone (QR)</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-5 bg-surface border border-border rounded-3xl shadow-2xl text-center">
          <DialogHeader className="text-center pb-1">
            <DialogTitle className="text-base font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              <BsLogo className="size-5" />
              <span>Connect your phone</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Scan the code with the bs mobile app. No manual setup.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <MobilePairingCard machineServerUrl={machineServerUrl} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-xs h-8 text-muted-foreground hover:text-foreground"
              onClick={handleOpenSettings}
            >
              <Icon name="Settings" className="size-3.5" />
              <span>Mobile settings</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
