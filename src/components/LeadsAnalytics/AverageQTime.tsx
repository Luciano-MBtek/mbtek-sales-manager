import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { calculatePercentageChange } from "@/lib/utils";

type AverageQualificationTimeProps = {
  current: { displayValue: number; unit: string };
  previous: { displayValue: number; unit: string };
};

export function AverageQualificationTime({
  current,
  previous,
}: AverageQualificationTimeProps) {
  const { percentageChange, formattedPercentage } = calculatePercentageChange(
    current.displayValue,
    previous.displayValue,
  );

  let textColorClass = "text-primary";
  let ComparisonIcon = null;

  if (percentageChange > 0) {
    textColorClass = "text-red-600";
    ComparisonIcon = TrendingDown;
  } else if (percentageChange < 0) {
    textColorClass = "text-green-600";
    ComparisonIcon = TrendingUp;
  } else if (percentageChange == 0) {
    textColorClass = "text-primary";
    ComparisonIcon = TrendingUp;
  }

  return (
    <Card className="bg-slate-50 h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center gap-2">
        <Clock className="h-10 w-10" />
        <CardTitle className="">Average Qualification Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {current.displayValue} {current.unit}
        </div>
        <div className="flex items-center gap-1">
          {ComparisonIcon && (
            <ComparisonIcon className={`h-4 w-4 ${textColorClass}`} />
          )}
          <CardDescription
            className={`${textColorClass} font-medium flex items-center`}
          >
            {previous.displayValue > 0 ? (
              <>
                {Math.abs(percentageChange) === 0
                  ? "No change"
                  : `${formattedPercentage}% ${percentageChange >= 0 ? "decrease speed" : "increase speed"}`}
                <span className="ml-1 text-gray-500">
                  vs previous: {previous.displayValue} {previous.unit}
                </span>
              </>
            ) : (
              "No previous data"
            )}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
