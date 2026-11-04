import { cn } from "@bb/shared-ui/lib/utils";
import bbLogoUrl from "../../../../../assets/bb-logo.svg";

export function BsLogo({ className = "size-4" }: { className?: string }) {
  return (
    <img
      src={bbLogoUrl}
      alt="b smart"
      aria-hidden="true"
      className={cn(className, "object-contain dark:invert dark:hue-rotate-180")}
    />
  );
}

export const BbLogo = BsLogo;
