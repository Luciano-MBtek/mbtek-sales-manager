"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  labels,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <div className="flex items-center justify-center w-full max-w-3xl">
        {Array.from({ length: steps }).map((_, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={cn(
                "flex items-center justify-center rounded-full w-10 h-10 text-sm font-medium transition-all",
                index + 1 === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index + 1 < currentStep
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>

            {index < steps - 1 && (
              <div className="flex-1 h-[2px] mx-2">
                <div
                  className={cn(
                    "h-full w-full",
                    index + 1 < currentStep ? "bg-primary/80" : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {labels && (
        <div className="flex items-center justify-center w-full max-w-3xl mt-2">
          {labels.map((label, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 text-center text-xs font-medium px-1",
                index + 1 === currentStep
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
