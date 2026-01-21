"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
              index < currentStep
                ? "bg-brand-500 text-white"
                : index === currentStep
                ? "bg-brand-500/20 text-brand-400 ring-2 ring-brand-500"
                : "bg-dark-800 text-dark-500"
            )}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-2",
                index < currentStep ? "bg-brand-500" : "bg-dark-800"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
