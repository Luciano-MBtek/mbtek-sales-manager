"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WheelProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: "sm" | "md" | "lg";
}

const WheelProgress = React.forwardRef<HTMLDivElement, WheelProgressProps>(
  ({ value, size = "md", className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
    };

    const circumference = 251.327; // Circumference of a circle with radius 40

    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-muted-foreground stroke-current"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          <motion.circle
            className="text-primary stroke-current"
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{
              strokeDasharray: `${(value * circumference) / 100} ${circumference}`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(value)}%</span>
        </div>
      </div>
    );
  }
);

WheelProgress.displayName = "WheelProgress";

export { WheelProgress };
