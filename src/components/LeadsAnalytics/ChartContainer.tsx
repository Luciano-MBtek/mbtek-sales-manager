import { AnalyticsChart } from "@/components/LeadsAnalytics/AnalyticsChart";
import { RadialChart } from "./RadialChart";

export type ChartDataPoint = {
  label: string;
  leads: number;
  contacts: number;
};

type ChartContainerProps = {
  data: ChartDataPoint[];
  range?: string | string[];
};

export function ChartContainer({ data, range }: ChartContainerProps) {
  return (
    <div className="flex justify-center w-full">
      <AnalyticsChart data={data} />
      <RadialChart data={data} range={range} />
    </div>
  );
}
