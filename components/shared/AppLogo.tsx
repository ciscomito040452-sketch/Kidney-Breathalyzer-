import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 96, className }: AppLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt={APP_NAME}
      width={size}
      height={size}
      className={cn("rounded-[22px] shadow-card", className)}
    />
  );
}
