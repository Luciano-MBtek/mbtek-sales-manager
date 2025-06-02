import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { calculatePercentageChange } from "@/lib/utils";
import { getAverageQualificationTime } from "@/actions/hubspot/getAverageQtime";

type AverageQualificationTimeProps = {
  currentDateParams: {
    from: string;
    to: string;
  };
  previousDateParams: {
    from: string;
    to: string;
  };
};

export async function AverageQualificationTime({
  currentDateParams,
  previousDateParams,
}: AverageQualificationTimeProps) {
  const qualificationTime = await getAverageQualificationTime(
    currentDateParams.from,
    currentDateParams.to
  );

  const previousQualificationTime = await getAverageQualificationTime(
    previousDateParams.from,
    previousDateParams.to
  );

  const { percentageChange, formattedPercentage } = calculatePercentageChange(
    qualificationTime.displayValue,
    previousQualificationTime.displayValue
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
          {qualificationTime.displayValue} {qualificationTime.unit}
        </div>
        <div className="flex items-center gap-1">
          {ComparisonIcon && (
            <ComparisonIcon className={`h-4 w-4 ${textColorClass}`} />
          )}
          <CardDescription
            className={`${textColorClass} font-medium flex items-center`}
          >
            {previousQualificationTime.displayValue > 0 ? (
              <>
                {Math.abs(percentageChange) === 0
                  ? "No change"
                  : `${formattedPercentage}% ${percentageChange >= 0 ? "decrease speed" : "increase speed"}`}
                <span className="ml-1 text-gray-500">
                  vs previous: {previousQualificationTime.displayValue}{" "}
                  {previousQualificationTime.unit}
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
