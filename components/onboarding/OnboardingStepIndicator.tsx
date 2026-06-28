import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingStepIndicator({
  currentStep,
  totalSteps,
}: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isCompleted && "bg-risk-low text-white",
                isActive && "bg-accent-primary text-white",
                !isCompleted && !isActive && "bg-surface text-[var(--text-secondary)]"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  isCompleted ? "bg-risk-low" : "bg-border-subtle"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
