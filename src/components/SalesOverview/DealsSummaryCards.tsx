import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ThumbsDown, ThumbsUp, Percent } from "lucide-react";
import { getOwnerDealsSummary } from "@/actions/hubspot/dealsSummary";

export function DealsSummaryCards() {
  return (
    <Suspense fallback={<DealsSummarySkeleton />}>
      <DealsSummaryContent />
    </Suspense>
  );
}

async function DealsSummaryContent() {
  const summary = await getOwnerDealsSummary();

  return (
    <div className="grid grid-cols-4 gap-3 w-full pr-4">
      <StatCard
        title="Open Deals"
        value={summary.open.toString()}
        color="blue"
        Icon={Briefcase}
      />
      <StatCard
        title="Deals Won"
        value={summary.won.toString()}
        color="green"
        Icon={ThumbsUp}
      />
      <StatCard
        title="Deals Lost"
        value={summary.lost.toString()}
        color="red"
        Icon={ThumbsDown}
      />
      <StatCard
        title="Conversion Rate"
        value={`${summary.conversionRate.toFixed(1)}%`}
        color="purple"
        Icon={Percent}
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  color: "blue" | "green" | "red" | "purple";
  Icon: React.ComponentType<{ className?: string }>;
};

function StatCard({ title, value, color, Icon }: StatCardProps) {
  const colorMap = {
    blue: "border-l-4 border-l-blue-500",
    green: "border-l-4 border-l-green-500",
    red: "border-l-4 border-l-red-500",
    purple: "border-l-4 border-l-purple-500",
  };

  const textColorMap = {
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
    purple: "text-purple-700",
  };

  return (
    <Card
      className={`shadow-sm hover:shadow transition-shadow ${colorMap[color]}`}
    >
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5">
        <CardTitle className="text-base font-medium text-gray-700">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${textColorMap[color]}`} />
      </CardHeader>
      <CardContent className="py-3 px-5">
        <div className={`text-2xl font-bold ${textColorMap[color]}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function DealsSummarySkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 w-full pr-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="shadow-sm border-l-4 border-l-gray-300">
          <CardHeader className="py-4 px-5">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="py-3 px-5">
            <Skeleton className="h-7 w-14" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
