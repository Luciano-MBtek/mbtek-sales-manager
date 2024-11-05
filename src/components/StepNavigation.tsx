"use client";

import clsx from "clsx";
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
    <div className="mb-12 lg:mb-0 min-w-60 p-4">
      {/* back button */}
      <Link
        href={getStepLink(steps[currentStep - 1] || steps[0])}
        className="mb-4 flex items-center gap-2 text-xl text-black disabled:text-white/50 lg:mb-12 lg:gap-5"
      >
        Back
      </Link>

      {/* list of form steps */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-8">
        {steps.map((step, i) => (
          <Link
            href={getStepLink(step)}
            key={`step-${i}`}
            className="group z-20 flex items-center gap-3 text-2xl"
            prefetch={true}
          >
            <span
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border  text-sm  transition-colors duration-200  lg:h-12 lg:w-12 lg:text-lg",
                {
                  "border-none bg-teal-500 text-black group-hover:border-none group-hover:text-black":
                    Array.isArray(step.route)
                      ? step.route.includes(currentPath)
                      : currentPath === step.route,
                  "border-white/75 bg-gray-900 group-hover:border-white group-hover:text-white text-white/75":
                    Array.isArray(step.route)
                      ? !step.route.includes(currentPath)
                      : currentPath !== step.route,
                }
              )}
            >
              {i + 1}
            </span>
            <span
              className={clsx(
                "hidden text-black/75 transition-colors duration-200 group-hover:text-black lg:block",
                {
                  "font-light": Array.isArray(step.route)
                    ? !step.route.includes(currentPath)
                    : currentPath !== step.route,
                  "font-semibold text-black": Array.isArray(step.route)
                    ? step.route.includes(currentPath)
                    : currentPath === step.route,
                }
              )}
            >
              {step.title}
            </span>
          </Link>
        ))}
        {/* mobile background dashes */}
        <div className="absolute top-4 flex h-1 w-full border-b border-dashed lg:hidden" />
      </div>
    </div>
  );
}
