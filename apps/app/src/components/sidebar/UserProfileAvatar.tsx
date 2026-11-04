import { useState } from "react";
import { Icon } from "@bb/shared-ui/icon";
import { Button } from "@bb/shared-ui/button";
import { Input } from "@bb/shared-ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@bb/shared-ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@bb/shared-ui/tooltip";
import { cn } from "@bb/shared-ui/lib/utils";
import { BsLogo } from "@/components/ui/bs-logo";
import { useBsAccount } from "@/lib/bs-account";

export function UserProfileAvatar({
  size = "rail",
  className,
}: {
  size?: "rail" | "compact";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputUsername, setInputUsername] = useState("Lounes-213");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { account, loading, error, connect, disconnect } = useBsAccount();

  const isRail = size === "rail";
  const isConnected = account.signedIn && Boolean(account.username);

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = await connect(inputUsername);
    if (success) {
      setAvatarFailed(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setInputUsername("Lounes-213");
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={
              isConnected
                ? `b smart account: @${account.username}`
                : "Connect to b smart with GitHub"
            }
            className={cn(
              "relative flex items-center justify-center rounded-full transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isRail ? "size-7 my-1" : "size-[26px] mx-1",
              className,
            )}
            onClick={() => setOpen(true)}
          >
            {isConnected && account.avatarUrl && !avatarFailed ? (
              <img
                src={account.avatarUrl}
                alt={account.username}
                className="size-full rounded-full object-cover ring-1 ring-border/80 hover:ring-primary/70 transition-all shadow-xs"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <span
                className={cn(
                  "size-full rounded-full flex items-center justify-center border transition-all",
                  isConnected
                    ? "bg-primary/10 border-primary/40 text-primary font-bold text-xs"
                    : "bg-surface-recessed border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {isConnected ? (
                  account.username.slice(0, 1).toUpperCase()
                ) : (
                  <Icon name="Github" className="size-3.5" />
                )}
              </span>
            )}

            {isConnected ? (
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2">
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500 ring-1 ring-surface" />
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2">
                <span className="relative inline-flex size-2 rounded-full bg-amber-400/80 ring-1 ring-surface" />
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side={isRail ? "right" : "bottom"}>
          {isConnected ? (
            <span>b smart: @{account.username} (Connected)</span>
          ) : (
            <span>Connect to b smart (GitHub)</span>
          )}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-5 bg-surface border border-border rounded-3xl shadow-2xl">
          {isConnected ? (
            <div className="space-y-4">
              <DialogHeader className="text-center pb-1">
                <div className="mx-auto relative mb-2">
                  {account.avatarUrl && !avatarFailed ? (
                    <img
                      src={account.avatarUrl}
                      alt={account.username}
                      className="size-16 rounded-full object-cover ring-2 ring-emerald-500/30 mx-auto shadow-md"
                      onError={() => setAvatarFailed(true)}
                    />
                  ) : (
                    <div className="size-16 rounded-full bg-primary/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-xl font-bold text-primary">
                      {account.username.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-1/2 translate-x-7 flex size-3.5">
                    <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
                  </span>
                </div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {account.name || account.username}
                </DialogTitle>
                <p className="text-xs font-mono text-muted-foreground">
                  @{account.username}
                </p>
                {account.bio && (
                  <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 px-2 italic">
                    "{account.bio}"
                  </p>
                )}
              </DialogHeader>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-recessed border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Icon name="Github" className="size-3.5 text-foreground" />
                    <span>GitHub Status</span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-recessed border border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <BsLogo className="size-3.5 text-foreground" />
                    <span>b smart Logic</span>
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-8.5 rounded-xl mt-1"
                  onClick={() => {
                    window.open(
                      account.htmlUrl || `https://github.com/${account.username}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <Icon name="ExternalLink" className="size-3.5" />
                  <span>View GitHub Profile</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-full gap-2 text-xs h-8.5 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                  onClick={handleDisconnect}
                >
                  <Icon name="CircleX" className="size-3.5" />
                  <span>Disconnect from b smart</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <DialogHeader className="text-center pb-1">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                  <Icon name="Github" className="size-6 text-foreground" />
                </div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Connect to b smart
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  b smart connection is powered by your GitHub profile. Enter your GitHub username to connect.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleConnect} className="space-y-3">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="bs-github-username" className="text-xs font-medium text-foreground">
                    GitHub Username
                  </label>
                  <div className="relative">
                    <Input
                      id="bs-github-username"
                      type="text"
                      placeholder="e.g. Lounes-213"
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      disabled={loading}
                      className="text-xs h-9 pl-7 pr-3 font-mono"
                    />
                    <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground select-none">
                      @
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {error}
                  </div>
                )}

                <div className="pt-1 flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={loading || !inputUsername.trim()}
                    className="w-full gap-2 text-xs h-9 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <Icon name="Spinner" className="size-4 animate-spin" />
                    ) : (
                      <Icon name="Github" className="size-4" />
                    )}
                    <span>{loading ? "Connecting…" : "Connect with GitHub"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground h-8"
                    onClick={() => {
                      setInputUsername("Lounes-213");
                    }}
                  >
                    Use default (@Lounes-213)
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
