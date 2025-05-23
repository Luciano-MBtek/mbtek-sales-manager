"use client";

import { CheckCircle2, ArrowRight, Flag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface QualificationStep {
  step: number;
  name: string;
}

interface LeadQualificationProgressProps {
  currentStep: number;
  steps: QualificationStep[];
  progressPercentage: number;
  className?: string;
}

export function LeadQualificationProgress({
  currentStep,
  steps,
  progressPercentage,
  className,
}: LeadQualificationProgressProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative mb-6">
        {/* Progress Bar */}
        <Progress value={progressPercentage} className="h-2 bg-slate-200" />

        {/* Steps positioned on top of the progress bar */}

        <div className="absolute bottom-4 left-0 w-full flex justify-between transform -translate-y-1/2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.step;
            const isCurrent = currentStep === step.step;
            const isLast = index === steps.length - 1;
            const position = `${(index / (steps.length - 1)) * 100}%`;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1"
                style={{
                  position: "absolute",
                  left: position,
                  transform: "translateX(-50%)",
                  maxWidth: "80px", // Limita el ancho máximo
                }}
              >
                <div className="flex items-center justify-center size-8 rounded-full bg-white border-2 border-slate-200">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 fill-white" />
                  ) : isCurrent ? (
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                  ) : isLast ? (
                    <Flag className="h-4 w-4 text-slate-400" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span className="text-xs font-medium mt-1 text-slate-700 text-center  w-full">
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
