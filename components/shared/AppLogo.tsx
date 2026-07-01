import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: number;
  className?: string;
  /** Compact mark for in-app headers; hero for landing */
  variant?: "default" | "mark" | "hero";
}

export function AppLogo({
  size = 96,
  className,
  variant = "default",
}: AppLogoProps) {
  const isMark = variant === "mark";
  const isHero = variant === "hero";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt={APP_NAME}
      width={size}
      height={size}
      className={cn(
        "object-contain",
        isMark && "app-logo-mark rounded-xl bg-surface ring-1 ring-border-subtle",
        isHero && "rounded-[22%]",
        !isMark && !isHero && "rounded-[22px] shadow-card",
        className
      )}
    />
  );
}
