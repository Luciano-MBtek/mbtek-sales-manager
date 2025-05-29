import PageHeader from "@/components/PageHeader";
import { LeadTotalCount } from "@/components/LeadsAnalytics/LeadsTotal";
import { DateRangeSelect } from "@/components/DateRangeSelect";
import { ContactTotalCount } from "@/components/LeadsAnalytics/ContactsTotal";
import { getDateRange, getPreviousRange } from "@/lib/range-date";
import { Suspense } from "react";
import { AverageQualificationTime } from "@/components/LeadsAnalytics/AverageQTime";
import { DealsTotalCount } from "@/components/LeadsAnalytics/DealsTotal";
import { AnalyticsSkeleton } from "@/components/LeadsAnalytics/AnalyticsSkeleton";
import { ChartContainer } from "@/components/LeadsAnalytics/ChartContainer";
import { sleep } from "@/lib/utils";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const StaggeredSuspense = ({
  children,
  fallback,
  delay = 0,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delay?: number;
}) => {
  return (
    <Suspense fallback={fallback}>
      <Delayed delay={delay}>{children}</Delayed>
    </Suspense>
  );
};

const Delayed = async ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => {
  if (delay > 0) {
    await sleep(delay);
  }
  return <>{children}</>;
};

async function AnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const range = params.range;

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

      <div className="flex w-full gap-4 justify-between">
        <StaggeredSuspense fallback={<AnalyticsSkeleton />} delay={0}>
          <div className="w-[250px]">
            <ContactTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </StaggeredSuspense>

        <StaggeredSuspense fallback={<AnalyticsSkeleton />} delay={700}>
          <div className="w-[250px]">
            <LeadTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </StaggeredSuspense>

        <StaggeredSuspense fallback={<AnalyticsSkeleton />} delay={1000}>
          <div className="w-[250px]">
            <AverageQualificationTime
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </StaggeredSuspense>

        <StaggeredSuspense fallback={<AnalyticsSkeleton />} delay={1800}>
          <div className="w-[250px]">
            <DealsTotalCount
              currentDateParams={currentDateParams}
              previousDateParams={previousDateParams}
            />
          </div>
        </StaggeredSuspense>
      </div>

      <StaggeredSuspense
        fallback={
          <div className="w-full flex items-center justify-center mt-4">
            <AnalyticsSkeleton />
          </div>
        }
        delay={1200}
      >
        <div className="w-full flex items-center justify-center mt-4">
          <ChartContainer currentDateParams={currentDateParams} range={range} />
        </div>
      </StaggeredSuspense>
    </div>
  );
}

export default AnalyticsPage;
