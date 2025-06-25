import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <StatCard
        title="Open Deals"
        value={summary.open.toString()}
        cardClass="border-blue-300 bg-blue-50"
        textClass="text-blue-700"
        Icon={Briefcase}
      />
      <StatCard
        title="Deals Won"
        value={summary.won.toString()}
        cardClass="border-green-300 bg-green-50"
        textClass="text-green-700"
        Icon={ThumbsUp}
      />
      <StatCard
        title="Deals Lost"
        value={summary.lost.toString()}
        cardClass="border-red-300 bg-red-50"
        textClass="text-red-700"
        Icon={ThumbsDown}
      />
      <StatCard
        title="Conversion Rate"
        value={`${summary.conversionRate.toFixed(1)}%`}
        cardClass="border-purple-300 bg-purple-50"
        textClass="text-purple-700"
        Icon={Percent}
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  cardClass: string;
  textClass: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function StatCard({ title, value, cardClass, textClass, Icon }: StatCardProps) {
  return (
    <Card className={cardClass}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className={`h-5 w-5 ${textClass}`} />
        <CardTitle className={textClass}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textClass} mb-1`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function DealsSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="bg-muted">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
