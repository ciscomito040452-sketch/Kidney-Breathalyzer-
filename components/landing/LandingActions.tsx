"use client";

import Link from "next/link";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingActionsProps {
  onDemo: () => void;
}

export function LandingActions({ onDemo }: LandingActionsProps) {
  const { translate } = usePreferences();
  const [isEntering, setIsEntering] = useState(false);

  function handleDemo() {
    if (isEntering) return;
    setIsEntering(true);
    window.setTimeout(() => {
      onDemo();
    }, 150);
  }

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-3">
      <Button
        size="lg"
        className={cn(
          "kb-pressable h-[50px] gap-2",
          isEntering && "opacity-80"
        )}
        onClick={handleDemo}
        disabled={isEntering}
      >
        <PlayCircle className="h-4 w-4" strokeWidth={1.75} />
        {translate("landingDemo")}
      </Button>

      <Link
        href="/onboarding"
        className="kb-pressable text-[15px] font-medium text-accent-primary transition-opacity hover:opacity-80"
      >
        {translate("landingStart")}
      </Link>

      <p className="text-center text-[13px] text-[var(--text-secondary)]">
        {translate("landingDemoHint")}
      </p>

      <p
        className="landing-footnote mt-1 max-w-full text-pretty text-center"
        role="note"
        aria-label={translate("medicalDisclaimerAria")}
      >
        {translate("medicalDisclaimer")}
      </p>
    </div>
  );
}
