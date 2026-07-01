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
    <div className="flex justify-center px-2">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isDone = isCompleted || isActive;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                  isDone
                    ? "bg-accent-primary text-white"
                    : "bg-surface text-[var(--text-secondary)] ring-1 ring-border-subtle",
                  isActive && "kb-pop-in"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="kb-pop-in h-4 w-4" strokeWidth={2.5} />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 w-10 rounded-full transition-colors duration-300 sm:w-12",
                    isCompleted ? "bg-accent-primary" : "bg-border-subtle"
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
