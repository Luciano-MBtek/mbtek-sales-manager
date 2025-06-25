import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, Label } from "recharts";
import { getOwnerDealsWonLost } from "@/actions/hubspot/dealsSummary";
import { PipelineSelect } from "./PipelineSelect";

const chartConfig = { rate: { label: "Rate", color: "#4ade80" } } satisfies ChartConfig;

export async function DealsWonLostChart({ pipeline }: { pipeline?: string }) {
  const { won, lost } = await getOwnerDealsWonLost(pipeline);
  const total = won + lost;
  const rate = total ? (won / total) * 100 : 0;

  return (
    <Card className="mr-4 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Win rate</CardTitle>
        <CardDescription>Deals Won vs Lost</CardDescription>
      </CardHeader>
      <CardContent className="mb-4">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            data={[{ name: "rate", value: rate, fill: "#4ade80" }]}
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={140}
            barSize={20}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(var(--muted))" }} />
            <PolarRadiusAxis tick={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  const { cx, cy } = viewBox;
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={cx} y={(cy as number) - 10} className="fill-foreground text-4xl font-bold">
                        {rate.toFixed(1)}%
                      </tspan>
                      <tspan x={cx} y={(cy as number) + 18} className="fill-muted-foreground text-sm">
                        {won} / {lost}
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-center">
        <PipelineSelect />
      </CardFooter>
    </Card>
  );
}
