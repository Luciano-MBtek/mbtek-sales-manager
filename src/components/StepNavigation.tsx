"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";

type StepLink<T> = T | ((pathname: string) => T);

type Step<T> = {
  title: string;
  route: string | string[];
  link?: StepLink<T>;
  routeType?: "b2b" | "b2c";
  links?: {
    b2b: StepLink<T>;
    b2c: StepLink<T>;
  };
};

interface StepNavigationProps<T> {
  steps: Step<T>[];
}

export default function StepNavigation({ steps }: StepNavigationProps<string>) {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setCurrentStep(
      steps.findIndex((step) =>
        Array.isArray(step.route)
          ? step.route.includes(currentPath)
          : step.route === currentPath
      )
    );
  }, [currentPath, steps]);

  const getStepLink = (step: Step<string>) => {
    const link =
      step.link ||
      (step.links &&
        (pathname.includes("b2b") ? step.links.b2b : step.links.b2c)) ||
      steps[0].link;
    return typeof link === "function" ? link(pathname) : link || "/";
  };

  return (
    <div className="mb-12 lg:mb-0 min-w-60 p-4 bg-white rounded-lg shadow-md">
      <Link
        href={getStepLink(steps[currentStep - 1] || steps[0])}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 lg:mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <nav className="relative lg:flex lg:justify-center" aria-label="Progress">
        <ol className="flex flex-row justify-between lg:flex-col lg:space-y-6">
          {steps.map((step, i) => {
            const isCurrentStep = Array.isArray(step.route)
              ? step.route.includes(currentPath)
              : currentPath === step.route;

            return (
              <li key={`step-${i}`} className="relative flex items-start">
                <Link
                  href={getStepLink(step)}
                  className={cn(
                    "group z-20 flex items-center gap-3",
                    isCurrentStep ? "pointer-events-none" : ""
                  )}
                  prefetch={true}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors duration-200 lg:h-12 lg:w-12 lg:text-base",
                      {
                        "border-primary bg-primary text-primary-foreground":
                          isCurrentStep,
                        "border-gray-300 bg-white text-gray-500 group-hover:border-gray-400 group-hover:bg-gray-50":
                          !isCurrentStep,
                      }
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm font-medium transition-colors duration-200 lg:block",
                      {
                        "text-primary": isCurrentStep,
                        "text-gray-500 group-hover:text-gray-700":
                          !isCurrentStep,
                      }
                    )}
                  >
                    {step.title}
                  </span>
                </Link>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-5 h-0.5 w-full lg:top-16 lg:left-6 lg:h-full lg:w-0.5",
                      isCurrentStep ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
