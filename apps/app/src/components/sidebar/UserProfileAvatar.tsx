import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { account, loading, error, connect } = useBsAccount();
  const navigate = useNavigate();

  const isRail = size === "rail";
  const isConnected = account.signedIn && Boolean(account.username);

  const openAccountPage = () => {
    navigate("/settings/plugins/bb-account");
  };

  const handleClick = () => {
    if (isConnected) {
      openAccountPage();
      return;
    }
    setOpen(true);
  };

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = await connect(inputUsername);
    if (success) {
      setAvatarFailed(false);
      setOpen(false);
      openAccountPage();
    }
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
            onClick={handleClick}
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
            <span>b smart account · @{account.username}</span>
          ) : (
            <span>Connect to b smart (GitHub)</span>
          )}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs p-5 bg-surface border border-border rounded-3xl shadow-2xl">
          <div className="space-y-4">
            <DialogHeader className="text-center pb-1">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                <Icon name="Github" className="size-6 text-foreground" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Connect to b smart
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                b smart connection is powered by your GitHub profile. Enter your
                GitHub username to connect.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConnect} className="space-y-3">
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="bs-github-username"
                  className="text-xs font-medium text-foreground"
                >
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
        </DialogContent>
      </Dialog>
    </>
  );
}
