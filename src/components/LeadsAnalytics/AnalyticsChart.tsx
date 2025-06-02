"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AnalyticsChartProps = {
  data: Array<{
    label: string;
    leads: number;
    contacts: number;
  }>;
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Format the data for the chart
  const chartData = data.map((item) => ({
    name: item.label,
    leads: item.leads,
    contacts: item.contacts,
  }));

  // Calculate totals
  const totalLeads = data.reduce((sum, item) => sum + item.leads, 0);
  const totalContacts = data.reduce((sum, item) => sum + item.contacts, 0);

  // Calculate trends for leads
  let leadsTrendPercent = 0;
  let isLeadsTrendUp = true;

  if (data.length > 1) {
    const firstValue = data[0].leads;
    const lastValue = data[data.length - 1].leads;

    if (firstValue > 0) {
      leadsTrendPercent = ((lastValue - firstValue) / firstValue) * 100;
      isLeadsTrendUp = leadsTrendPercent >= 0;
    } else if (lastValue > 0) {
      leadsTrendPercent = 100;
      isLeadsTrendUp = true;
    }
  }

  // Format the trend percentage to show only one decimal
  const formattedLeadsTrendPercent = Math.abs(leadsTrendPercent).toFixed(1);

  // Get date range description
  let dateRangeDescription = "Showing data";
  if (data.length > 0) {
    dateRangeDescription = `${data[0].label} - ${data[data.length - 1].label}`;
  }

  return (
    <Card className="w-full mr-4">
      <CardHeader>
        <CardTitle>Leads & Contacts Acquisition Trends</CardTitle>
        <CardDescription>
          Total leads: {totalLeads} | Total contacts: {totalContacts}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#f97316" // Orange-500
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#0ea5e9" // Sky-500
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#f97316" // Orange-500
              fillOpacity={1}
              fill="url(#colorLeads)"
            />
            <Area
              type="monotone"
              dataKey="contacts"
              name="Contacts"
              stroke="#0ea5e9" // Sky-500
              fillOpacity={1}
              fill="url(#colorContacts)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {data.length > 1 && (
              <div className="flex items-center gap-2 font-medium leading-none">
                Leads{" "}
                {leadsTrendPercent === 0 ? (
                  <>
                    no change 0% <Minus className="h-4 w-4 text-gray-500" />
                  </>
                ) : isLeadsTrendUp ? (
                  <>
                    trending up by {formattedLeadsTrendPercent}%{" "}
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </>
                ) : (
                  <>
                    trending down by {formattedLeadsTrendPercent}%{" "}
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRangeDescription}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
