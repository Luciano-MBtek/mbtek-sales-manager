"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";
import { collectDataRoutes } from "@/types";
type StepLink = collectDataRoutes | ((pathname: string) => collectDataRoutes);

const steps: Array<{
  title: string;
  route: string | string[];
  link: StepLink;
}> = [
  {
    title: "Step One",
    route: "step-one",
    link: collectDataRoutes.DISCOVERY_CALL,
  },
  {
    title: "Step Two",
    route: "step-two",
    link: collectDataRoutes.DISCOVERY_CALL_2,
  },
  {
    title: "Step Three",
    route: ["step-three-b2c", "step-three-b2b"],
    link: (pathname: string) =>
      pathname.includes("b2b")
        ? collectDataRoutes.LEAD_QUALIFICATION_B2B
        : collectDataRoutes.LEAD_QUALIFICATION_B2C,
  },
  {
    title: "Step Four",
    route: "step-four",
    link: collectDataRoutes.LEAD_QUALIFICATION_B2C_2,
  },
  { title: "Review", route: "review", link: collectDataRoutes.REVIEW_LEAD },
];

export default function StepNavigation() {
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
  }, [currentPath]);

  return (
    <div className="mb-12 lg:mb-0 min-w-60 p-4">
      {/* back button */}
      <Link
        href={(() => {
          const link = steps[currentStep - 1]?.link;
          if (typeof link === "function") {
            return link(pathname);
          }
          return link || steps[0].link;
        })()}
        className="mb-4 flex items-center gap-2 text-xl text-black disabled:text-white/50 lg:mb-12 lg:gap-5"
      >
        Back
      </Link>

      {/* list of form steps */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-8">
        {steps.map((step, i) => (
          <Link
            href={
              typeof step.link === "function" ? step.link(pathname) : step.link
            }
            key={typeof step.link === "function" ? `step-${i}` : step.link}
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
