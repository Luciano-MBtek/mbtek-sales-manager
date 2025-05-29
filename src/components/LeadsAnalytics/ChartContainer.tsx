import { AnalyticsChart } from "@/components/LeadsAnalytics/AnalyticsChart";
import { getLeadsCount } from "@/actions/hubspot/leadsCount";
import { getContactsCount } from "@/actions/hubspot/contactsCount";
import {
  format,
  differenceInDays,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { RadialChart } from "./RadialChart";

type ChartContainerProps = {
  currentDateParams: {
    from: string;
    to: string;
  };
  range?: string | string[];
};

type ChartDataPoint = {
  label: string;
  leads: number;
  contacts: number;
};

// Function to fetch data on a daily basis
async function fetchDailyData(
  fromDate: Date,
  toDate: Date
): Promise<ChartDataPoint[]> {
  const result: ChartDataPoint[] = [];
  let currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const [leadsCount, contactsCount] = await Promise.all([
      getLeadsCount(startOfDay.toISOString(), endOfDay.toISOString()),
      getContactsCount(startOfDay.toISOString(), endOfDay.toISOString()),
    ]);

    result.push({
      label: format(currentDate, "EEE"), // Mon, Tue, etc.
      leads: leadsCount,
      contacts: contactsCount,
    });

    currentDate = addDays(currentDate, 1);
  }

  return result;
}

// Function to fetch data on a weekly basis
async function fetchWeeklyData(
  fromDate: Date,
  toDate: Date
): Promise<ChartDataPoint[]> {
  const result: ChartDataPoint[] = [];
  let currentWeekStart = startOfWeek(fromDate, { weekStartsOn: 1 }); // Start on Monday

  while (currentWeekStart <= toDate) {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const adjustedWeekEnd = weekEnd > toDate ? toDate : weekEnd;

    const [leadsCount, contactsCount] = await Promise.all([
      getLeadsCount(
        currentWeekStart.toISOString(),
        adjustedWeekEnd.toISOString()
      ),
      getContactsCount(
        currentWeekStart.toISOString(),
        adjustedWeekEnd.toISOString()
      ),
    ]);

    result.push({
      label: `${format(currentWeekStart, "MMM d")} - ${format(adjustedWeekEnd, "MMM d")}`,
      leads: leadsCount,
      contacts: contactsCount,
    });

    currentWeekStart = addDays(weekEnd, 1);
  }

  return result;
}

// Function to fetch data on a monthly basis
async function fetchMonthlyData(
  fromDate: Date,
  toDate: Date
): Promise<ChartDataPoint[]> {
  const result: ChartDataPoint[] = [];
  let currentMonthStart = startOfMonth(fromDate);

  while (currentMonthStart <= toDate) {
    const monthEnd = endOfMonth(currentMonthStart);
    const adjustedMonthEnd = monthEnd > toDate ? toDate : monthEnd;

    const [leadsCount, contactsCount] = await Promise.all([
      getLeadsCount(
        currentMonthStart.toISOString(),
        adjustedMonthEnd.toISOString()
      ),
      getContactsCount(
        currentMonthStart.toISOString(),
        adjustedMonthEnd.toISOString()
      ),
    ]);

    result.push({
      label: format(currentMonthStart, "MMM"),
      leads: leadsCount,
      contacts: contactsCount,
    });

    // Move to the first day of the next month
    currentMonthStart = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() + 1,
      1
    );
  }

  return result;
}

export async function ChartContainer({
  currentDateParams,
  range,
}: ChartContainerProps) {
  const fromDate = new Date(currentDateParams.from);
  const toDate = new Date(currentDateParams.to);
  const daysDifference = differenceInDays(toDate, fromDate);

  let chartData: ChartDataPoint[] = [];

  // For 1 week period or less, show daily data
  if (daysDifference <= 7) {
    chartData = await fetchDailyData(fromDate, toDate);
  }
  // For 1 month period, show weekly data
  else if (daysDifference <= 31) {
    chartData = await fetchWeeklyData(fromDate, toDate);
  }
  // For longer periods (e.g., 6 months), show monthly data
  else {
    chartData = await fetchMonthlyData(fromDate, toDate);
  }

  return (
    <div className="flex justify-center w-full">
      <AnalyticsChart data={chartData} />
      <RadialChart data={chartData} range={range} />
    </div>
  );
}
