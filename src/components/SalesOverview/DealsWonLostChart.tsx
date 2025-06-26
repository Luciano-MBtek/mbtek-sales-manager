// src/components/SalesOverview/DealsWonLostChart.tsx
"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
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
  DealsWonLostOverTime,
  getDealsWonLostOverTime,
} from "@/actions/hubspot/dealsSummary";
import { PipelineSelect } from "./PipelineSelect";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const chartConfig = {
  won: { label: "Won", color: "#4ade80" },
  lost: { label: "Lost", color: "#f43f5e" },
} satisfies ChartConfig;

export function DealsWonLostChart({
  summary,
}: {
  summary?: DealsWonLostOverTime[];
}) {
  const [timeData, setTimeData] = useState<DealsWonLostOverTime[]>([]);
  const [loading, setLoading] = useState(!summary);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("all");

  // Calculate totals from the time data
  const totalWon = timeData.reduce((sum, item) => sum + item.won, 0);
  const totalLost = timeData.reduce((sum, item) => sum + item.lost, 0);
  const total = totalWon + totalLost;
  const rate = total ? (totalWon / total) * 100 : 0;

  useEffect(() => {
    // Only fetch if no data was provided or pipeline changes
    if (!summary || selectedPipeline !== "all") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getDealsWonLostOverTime(selectedPipeline);
          setTimeData(data);
        } catch (error) {
          console.error("Error fetching deals over time:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedPipeline, summary]);

  // Calculate trend if we have data
  const calculateTrend = () => {
    if (timeData.length < 2) return null;

    const firstItem = timeData[0];
    const lastItem = timeData[timeData.length - 1];

    const firstRate =
      firstItem.won + firstItem.lost === 0
        ? 0
        : (firstItem.won / (firstItem.won + firstItem.lost)) * 100;

    const lastRate =
      lastItem.won + lastItem.lost === 0
        ? 0
        : (lastItem.won / (lastItem.won + lastItem.lost)) * 100;

    const trendDiff = lastRate - firstRate;

    if (Math.abs(trendDiff) < 0.1) return "stable";
    return trendDiff > 0 ? "up" : "down";
  };

  const trend = calculateTrend();

  const handlePipelineChange = (pipeline: string) => {
    setSelectedPipeline(pipeline);
  };

  return (
    <Card className="mr-4 flex flex-col">
      <CardHeader>
        <CardTitle>Deals Won vs Lost</CardTitle>
        <CardDescription>
          <CardDescription>
            Win rate: {rate.toFixed(1)}% ({totalWon} won / {totalLost} lost)
          </CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>Loading chart data...</p>
          </div>
        ) : timeData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p>No deals data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={timeData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#4ade80" // Green
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#f43f5e" // Red
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="won"
                name="Won"
                stroke="#4ade80"
                fillOpacity={1}
                fill="url(#colorWon)"
              />
              <Area
                type="monotone"
                dataKey="lost"
                name="Lost"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#colorLost)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2 font-medium leading-none">
          Win rate{" "}
          {trend === "stable" ? (
            <>
              stable <Minus className="h-4 w-4 text-gray-500" />
            </>
          ) : trend === "up" ? (
            <>
              trending up <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : trend === "down" ? (
            <>
              trending down <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          ) : null}
        </div>
        <PipelineSelect onPipelineChange={handlePipelineChange} />
      </CardFooter>
    </Card>
  );
}
