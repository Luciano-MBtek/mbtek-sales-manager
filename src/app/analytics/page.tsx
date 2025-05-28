import PageHeader from "@/components/PageHeader";
import { LeadTotalCount } from "@/components/LeadsAnalytics/LeadsTotal";
import { DateRangeSelect } from "@/components/DateRangeSelect";
import { ContactTotalCount } from "@/components/LeadsAnalytics/ContactsTotal";
import { getDateRange, getPreviousRange } from "@/lib/range-date";
import { Suspense } from "react";
import { AverageQualificationTime } from "@/components/LeadsAnalytics/AverageQTime";
import { DealsTotalCount } from "@/components/LeadsAnalytics/DealsTotal";
import { AnalyticsSkeleton } from "@/components/LeadsAnalytics/AnalyticsSkeleton";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function AnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const dateRange = getDateRange(params);
  const { previousFrom, previousTo } = getPreviousRange(dateRange);

  const currentDateParams = {
    from: dateRange.fromISO,
    to: dateRange.toISO,
  };

  const previousDateParams = {
    from: previousFrom.toISOString(),
    to: previousTo.toISOString(),
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex items-center justify-between">
        <PageHeader
          title="Reports and analytics"
          subtitle="Track your metric and performances"
          className="w-[500px]"
        />
        <DateRangeSelect />
      </div>

      <div className="flex w-full gap-4 justify-evenly">
        <Suspense fallback={<AnalyticsSkeleton />}>
          <div className="w-[250px]">
            <ContactTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </Suspense>

        <Suspense fallback={<AnalyticsSkeleton />}>
          <div className="w-[250px]">
            <LeadTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </Suspense>

        <Suspense fallback={<AnalyticsSkeleton />}>
          <div className="w-[250px]">
            <AverageQualificationTime
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </Suspense>
        <Suspense fallback={<AnalyticsSkeleton />}>
          <div className="w-[250px]">
            <DealsTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </Suspense>

        {/* Chart here */}
      </div>
    </div>
  );
}

export default AnalyticsPage;
