// Actualización del componente ContactsTotal para recibir datos como props
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { calculatePercentageChange } from "@/lib/utils";
import { HubspotIcon } from "../HubspotIcon";
import { getContactsCount } from "@/actions/hubspot/contactsCount";

type ContactTotalCountProps = {
  currentDateParams: {
    from: string;
    to: string;
  };
  previousDateParams: {
    from: string;
    to: string;
  };
};

export async function ContactTotalCount({
  currentDateParams,
  previousDateParams,
}: ContactTotalCountProps) {
  const currentPeriodContactCount = await getContactsCount(
    currentDateParams.from,
    currentDateParams.to
  );

  const previousPeriodContactCount = await getContactsCount(
    previousDateParams.from,
    previousDateParams.to
  );

  const { percentageChange, formattedPercentage } = calculatePercentageChange(
    currentPeriodContactCount,
    previousPeriodContactCount
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
    <Card className="bg-slate-50 h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center gap-2">
        <HubspotIcon size={30} color="orange" />
        <CardTitle className="">Total new contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{currentPeriodContactCount}</div>
        <div className="flex items-center gap-1">
          {ComparisonIcon && (
            <ComparisonIcon className={`h-4 w-4 ${textColorClass}`} />
          )}
          <CardDescription
            className={`${textColorClass} font-medium flex items-center`}
          >
            {previousPeriodContactCount > 0 ? (
              <>
                {Math.abs(percentageChange) === 0
                  ? "No change"
                  : `${formattedPercentage}% ${percentageChange >= 0 ? "increase" : "decrease"}`}
                <span className="ml-1 text-gray-500">
                  vs previous: {previousPeriodContactCount}
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
