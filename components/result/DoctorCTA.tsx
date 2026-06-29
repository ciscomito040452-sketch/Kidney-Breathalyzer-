"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { DoctorGuidanceSheet } from "@/components/shared/DoctorGuidanceSheet";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { Button } from "@/components/ui/button";
import type { DoctorCtaVariant } from "@/lib/dashboard/should-show-doctor-cta";
import { cn } from "@/lib/utils";

interface DoctorCTAProps {
  variant?: DoctorCtaVariant;
  className?: string;
}

export function DoctorCTA({ variant = "primary", className }: DoctorCTAProps) {
  const { translate } = usePreferences();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        className={cn(
          "w-full gap-2",
          variant === "soft" &&
            "border border-accent-primary/30 bg-accent-primary/8 text-accent-primary hover:bg-accent-primary/12",
          className
        )}
        variant={variant === "primary" ? "default" : "secondary"}
        onClick={() => setSheetOpen(true)}
      >
        <Stethoscope className="h-5 w-5" />
        {translate("seeDoctorAction")}
      </Button>

      <DoctorGuidanceSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
