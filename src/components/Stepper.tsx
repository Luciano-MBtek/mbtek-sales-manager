"use client";
import { Check } from "lucide-react";
import { useState } from "react";

const steps = [
  { id: 1, name: "Step 1", description: "Discovery Call" },
  { id: 2, name: "Step 2", description: "Lead Qualification" },
  { id: 3, name: "Step 3", description: "Project Data Collection" },
  { id: 4, name: "Step 4", description: "Project System Data Collection" },
  { id: 5, name: "Step 5", description: "Schematic Upload" },
  { id: 6, name: "Step 6", description: "Project Proposal" },
];

export default function Stepper() {
  const currentStep = 3;
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <nav aria-label="Progress" className="w-full max-w-4xl mx-auto">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}
            onMouseEnter={() => setHoveredStep(step.id)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div
              className={`group flex items-center transition-transform duration-200 ease-in-out ${
                hoveredStep === step.id ? "scale-110" : ""
              }`}
            >
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    step.id < currentStep
                      ? "bg-primary"
                      : step.id === currentStep
                        ? "border-2 border-primary"
                        : "border-2 border-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check
                      className="h-6 w-6 text-primary-foreground"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className={
                        step.id === currentStep
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {step.id}
                    </span>
                  )}
                </span>
                <span
                  className={`ml-4 text-sm font-medium ${
                    step.id <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </span>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute top-0 right-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className={`h-full w-full ${
                      step.id < currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : null}
            </div>
            {hoveredStep === step.id && (
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg transition-opacity duration-200"
                role="tooltip"
              >
                {step.description}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
