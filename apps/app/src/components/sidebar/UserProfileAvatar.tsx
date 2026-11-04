import { useState, useEffect } from "react";
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

interface UserAccountInfo {
  signedIn: boolean;
  username: string;
  name: string;
  avatarUrl: string;
}

const DEFAULT_USER: UserAccountInfo = {
  signedIn: true,
  username: "Lounes-213",
  name: "Lounes",
  avatarUrl: "https://github.com/Lounes-213.png",
};

export function UserProfileAvatar({
  size = "rail",
  className,
}: {
  size?: "rail" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<UserAccountInfo>(DEFAULT_USER);

  useEffect(() => {
    let cancelled = false;
    // Check if bb-account RPC has signed in state
    fetch("/api/v1/plugins/bb-account/rpc/bb-account.v1.status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !data.ok) return;
        const result = data.result;
        if (result && result.state === "signed-in" && result.account) {
          const acc = result.account;
          setAccount({
            signedIn: true,
            username: acc.githubLogin || "Lounes-213",
            name: acc.name || acc.githubLogin || "Lounes",
            avatarUrl:
              acc.avatarUrl ||
              `https://github.com/${acc.githubLogin || "Lounes-213"}.png`,
          });
        }
      })
      .catch(() => {
        // Fallback to default user
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isRail = size === "rail";

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`GitHub profile: @${account.username}`}
            className={cn(
              "relative flex items-center justify-center rounded-full transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isRail ? "size-7 my-1" : "size-[26px] mx-1",
              className,
            )}
            onClick={() => setOpen(true)}
          >
            <img
              src={account.avatarUrl}
              alt={account.username}
              className="size-full rounded-full object-cover ring-1 ring-border/80 hover:ring-primary/70 transition-all shadow-xs"
              onError={(e) => {
                // If avatar fails to load, fallback to GitHub icon
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Green connection dot */}
            {account.signedIn && (
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2">
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500 ring-1 ring-surface" />
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side={isRail ? "right" : "bottom"}>
          <span>GitHub: @{account.username}</span>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-5 bg-surface border border-border rounded-2xl shadow-xl">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto relative mb-3">
              <img
                src={account.avatarUrl}
                alt={account.username}
                className="size-16 rounded-full object-cover ring-2 ring-primary/30 mx-auto shadow-md"
              />
              <span className="absolute bottom-0 right-1/2 translate-x-7 flex size-3">
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </span>
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              {account.name}
            </DialogTitle>
            <p className="text-xs font-mono text-muted-foreground">
              @{account.username}
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-2 pt-2 text-xs">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-recessed border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Icon name="Github" className="size-3.5" />
                <span>GitHub Status</span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs h-8"
              onClick={() => {
                window.open(
                  `https://github.com/${account.username}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              <Icon name="ExternalLink" className="size-3.5" />
              <span>View GitHub Profile</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
