import PageHeader from "@/components/PageHeader";
import { LeadTotalCount } from "@/components/LeadsAnalytics/LeadsTotal";
import { DateRangeSelect } from "@/components/DateRangeSelect";
import { ContactTotalCount } from "@/components/LeadsAnalytics/ContactsTotal";
import { getDateRange, getPreviousRange } from "@/lib/range-date";

import { AverageQualificationTime } from "@/components/LeadsAnalytics/AverageQTime";
import { DealsTotalCount } from "@/components/LeadsAnalytics/DealsTotal";

import {
  ChartContainer,
  ChartDataPoint,
} from "@/components/LeadsAnalytics/ChartContainer";

import {
  getContactsAndLeadsInRange,
  getDealsInRange,
  getQualificationTimesInRange,
  ContactLeadInfo,
  QualificationInfo,
} from "@/actions/hubspot/analyticsData";
import {
  differenceInDays,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isWithinInterval,
} from "date-fns";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function AnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const range = params.range;

  const dateRange = getDateRange(params);
  const { previousFrom, previousTo } = getPreviousRange(dateRange);

  const fullFrom = previousFrom.toISOString();
  const fullTo = dateRange.toISO;

  const hubspotId = typeof params.hubspotId === "string" ? params.hubspotId : undefined;

  const [contactsLeads, dealsData, qtimes] = await Promise.all([
    getContactsAndLeadsInRange(fullFrom, fullTo, hubspotId),
    getDealsInRange(fullFrom, fullTo, hubspotId),
    getQualificationTimesInRange(fullFrom, fullTo, hubspotId),
  ]);

  const isCurrent = (d: string) =>
    isWithinInterval(new Date(d), {
      start: new Date(dateRange.fromISO),
      end: new Date(dateRange.toISO),
    });
  const isPrevious = (d: string) =>
    isWithinInterval(new Date(d), { start: previousFrom, end: previousTo });

  const contactsCurrent = contactsLeads.contacts.filter((c) =>
    isCurrent(c.createdate)
  );
  const contactsPrevious = contactsLeads.contacts.filter((c) =>
    isPrevious(c.createdate)
  );

  const leadsCurrent = contactsCurrent.filter(
    (c) => c.lead_owner_id === contactsLeads.ownerId
  );
  const leadsPrevious = contactsPrevious.filter(
    (c) => c.lead_owner_id === contactsLeads.ownerId
  );

  const dealsCurrentCount = dealsData.filter((d) =>
    isCurrent(d.createdate)
  ).length;
  const dealsPreviousCount = dealsData.filter((d) =>
    isPrevious(d.createdate)
  ).length;

  const qCurrent = qtimes.filter((q) => isCurrent(q.createdate));
  const qPrevious = qtimes.filter((q) => isPrevious(q.createdate));

  const avgFormat = (values: QualificationInfo[]) => {
    if (!values.length) return { displayValue: 0, unit: "Minutes" };
    const avgMs = values.reduce((sum, v) => sum + v.diffMs, 0) / values.length;
    const mins = +(avgMs / 60_000).toFixed(1);
    const hours = +(avgMs / 3_600_000).toFixed(1);
    const days = +(avgMs / 86_400_000).toFixed(2);
    return days >= 1
      ? { displayValue: days, unit: "Days" }
      : hours >= 1
        ? { displayValue: hours, unit: "Hours" }
        : { displayValue: mins, unit: "Minutes" };
  };

  const avgCurrent = avgFormat(qCurrent);
  const avgPrevious = avgFormat(qPrevious);

  const aggregateChart = (
    contacts: ContactLeadInfo[],
    leads: ContactLeadInfo[],
    from: Date,
    to: Date
  ): ChartDataPoint[] => {
    const daysDiff = differenceInDays(to, from);
    const result: ChartDataPoint[] = [];

    if (daysDiff <= 7) {
      let current = new Date(from);
      while (current <= to) {
        const start = new Date(current);
        start.setHours(0, 0, 0, 0);
        const end = new Date(current);
        end.setHours(23, 59, 59, 999);
        const lc = leads.filter((l) =>
          isWithinInterval(new Date(l.createdate), { start, end })
        ).length;
        const cc = contacts.filter((c) =>
          isWithinInterval(new Date(c.createdate), { start, end })
        ).length;
        result.push({ label: format(current, "EEE"), leads: lc, contacts: cc });
        current = addDays(current, 1);
      }
    } else if (daysDiff <= 31) {
      let currentStart = startOfWeek(from, { weekStartsOn: 1 });
      while (currentStart <= to) {
        const weekEnd = endOfWeek(currentStart, { weekStartsOn: 1 });
        const adjustedEnd = weekEnd > to ? to : weekEnd;
        const lc = leads.filter((l) =>
          isWithinInterval(new Date(l.createdate), {
            start: currentStart,
            end: adjustedEnd,
          })
        ).length;
        const cc = contacts.filter((c) =>
          isWithinInterval(new Date(c.createdate), {
            start: currentStart,
            end: adjustedEnd,
          })
        ).length;
        result.push({
          label: `${format(currentStart, "MMM d")} - ${format(adjustedEnd, "MMM d")}`,
          leads: lc,
          contacts: cc,
        });
        currentStart = addDays(weekEnd, 1);
      }
    } else {
      let currentMonth = startOfMonth(from);
      while (currentMonth <= to) {
        const monthEnd = endOfMonth(currentMonth);
        const adjustedEnd = monthEnd > to ? to : monthEnd;
        const lc = leads.filter((l) =>
          isWithinInterval(new Date(l.createdate), {
            start: currentMonth,
            end: adjustedEnd,
          })
        ).length;
        const cc = contacts.filter((c) =>
          isWithinInterval(new Date(c.createdate), {
            start: currentMonth,
            end: adjustedEnd,
          })
        ).length;
        result.push({
          label: format(currentMonth, "MMM"),
          leads: lc,
          contacts: cc,
        });
        currentMonth = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        );
      }
    }
    return result;
  };

  const chartData = aggregateChart(
    contactsCurrent,
    leadsCurrent,
    new Date(dateRange.fromISO),
    new Date(dateRange.toISO)
  );

  return (
    <div className="flex flex-col w-full h-full mt-[--header-height]">
      <div className="w-full flex items-center justify-between">
        <PageHeader
          title="Reports and analytics"
          subtitle="Track your metric and performances"
          className="w-[500px]"
        />
        <DateRangeSelect />
      </div>

      <div className="flex w-full gap-4 justify-between">
        <div className="w-[250px]">
          <ContactTotalCount
            currentPeriodCount={contactsCurrent.length}
            previousPeriodCount={contactsPrevious.length}
          />
        </div>

        <div className="w-[250px]">
          <LeadTotalCount
            currentPeriodCount={leadsCurrent.length}
            previousPeriodCount={leadsPrevious.length}
          />
        </div>

        <div className="w-[250px]">
          <AverageQualificationTime
            current={avgCurrent}
            previous={avgPrevious}
          />
        </div>

        <div className="w-[250px]">
          <DealsTotalCount
            currentPeriodCount={dealsCurrentCount}
            previousPeriodCount={dealsPreviousCount}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <ChartContainer data={chartData} range={range} />
      </div>
    </div>
  );
}

export default AnalyticsPage;
