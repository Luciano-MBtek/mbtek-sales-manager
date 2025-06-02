import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileCheck, TrendingUp, TrendingDown } from "lucide-react";

import { calculatePercentageChange } from "@/lib/utils";
import { getDealsCount } from "@/actions/hubspot/dealsCount";

type LeadTotalCountProps = {
  currentDateParams: {
    from: string;
    to: string;
  };
  previousDateParams: {
    from: string;
    to: string;
  };
};

export async function DealsTotalCount({
  currentDateParams,
  previousDateParams,
}: LeadTotalCountProps) {
  const currentPeriodLeadCount = await getDealsCount(
    currentDateParams.from,
    currentDateParams.to
  );

  const previousPeriodLeadCount = await getDealsCount(
    previousDateParams.from,
    previousDateParams.to
  );

  const { percentageChange, formattedPercentage } = calculatePercentageChange(
    currentPeriodLeadCount,
    previousPeriodLeadCount
  );

  let textColorClass = "text-primary";
  let ComparisonIcon = null;

  if (percentageChange > 0) {
    textColorClass = "text-green-600";
    ComparisonIcon = TrendingUp;
  } else if (percentageChange < 0) {
    textColorClass = "text-red-600";
    ComparisonIcon = TrendingDown;
  }

  return (
    <Card className="bg-slate-50 h-full flex flex-col justify-between mr-4">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileCheck className="h-5 w-5" />
        <CardTitle className="">Assigned Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{currentPeriodLeadCount}</div>
        <div className="flex items-center gap-1">
          {ComparisonIcon && (
            <ComparisonIcon className={`h-4 w-4 ${textColorClass}`} />
          )}
          <CardDescription
            className={`${textColorClass} font-medium flex items-center`}
          >
            {previousPeriodLeadCount > 0 ? (
              <>
                {Math.abs(percentageChange) === 0
                  ? "No change"
                  : `${formattedPercentage}% ${percentageChange >= 0 ? "increase" : "decrease"}`}
                <span className="ml-1 text-gray-500">
                  vs previous: {previousPeriodLeadCount}
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
