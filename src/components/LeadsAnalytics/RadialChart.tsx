"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { dateRanges } from "@/components/DateRangeSelect";

import {
  PolarAngleAxis, // eje angular → 0-100 %
  PolarRadiusAxis, // solo para la etiqueta central
  RadialBarChart,
  RadialBar,
  Label,
} from "recharts";

const chartConfig = {
  leads: { label: "Leads" },
  safari: { label: "Safari", color: "#f97316" },
} satisfies ChartConfig;

type RadialChartProps = {
  range?: string | string[];
  data: { label: string; leads: number; contacts: number }[];
};

export function RadialChart({ data, range }: RadialChartProps) {
  const totalLeads = data.reduce((s, i) => s + i.leads, 0);
  const totalContacts = data.reduce((s, i) => s + i.contacts, 0);
  const average = totalContacts ? (totalLeads / totalContacts) * 100 : 0;

  // categoría y color
  const bands = {
    Danger: [0, 10],
    Low: [11, 15],
    Average: [16, 25],
    Good: [26, 40],
    Excellent: [41, 60],
    Godlike: [61, 80],
    Impossible: [81, 100],
  } as const;

  const category =
    (Object.entries(bands).find(
      ([, [min, max]]) => average >= min && average <= max
    )?.[0] as keyof typeof bands) || "Unknown";

  const colors = {
    Danger: "text-red-500",
    Low: "text-orange-500",
    Average: "text-yellow-500",
    Good: "text-blue-500",
    Excellent: "text-green-500",
    Godlike: "text-purple-500",
    Impossible: "text-pink-500",
    Unknown: "text-muted-foreground",
  } as const;

  return (
    <Card className="mr-4 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Qualification rate</CardTitle>
        <CardDescription>Leads / Contacts</CardDescription>
      </CardHeader>

      <CardContent className="mb-4 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={[{ name: "avg", value: average, fill: "#f97316" }]}
            startAngle={90} // 12 en punto
            endAngle={-270} // giro completo horario
            innerRadius={80}
            outerRadius={140}
            barSize={20}
          >
            {/* Eje angular fijo a 0-100 % ⇒ relleno proporcional */}
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

            {/* Barra principal + pista de fondo */}
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "hsl(var(--muted))" }}
            />

            {/* Etiqueta central */}
            <PolarRadiusAxis tick={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                    return null;

                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={(cy as number) - 10}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {average.toFixed(1)}%
                      </tspan>
                      <tspan
                        x={cx}
                        y={(cy as number) + 18}
                        className="fill-muted-foreground text-sm"
                      >
                        {totalLeads} / {totalContacts}
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span className={colors[category]}>Performance: {category}</span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average conversion rate from contacts to leads during{" "}
          {dateRanges.find((r) => r.value === range)?.label.toLowerCase() ||
            "the selected period"}
          .
        </div>
      </CardFooter>
    </Card>
  );
}
