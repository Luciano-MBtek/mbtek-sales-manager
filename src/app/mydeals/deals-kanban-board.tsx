"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  calculateDealProgress,
  calculateTotal,
  dealStage,
  formatCurrency,
  getDealStageLabel,
  getPipelineLabel,
  isEndingSoon,
} from "./utils";
import { Deal } from "./deals";
import { DealCard } from "./deal-kanban-card";

interface DealsKanbanBoardProps {
  deals: Deal[];
}

const DealsKanbanBoard = ({ deals }: DealsKanbanBoardProps) => {
  const mostDealsPipeline = useMemo(() => {
    const pipelineCounts: Record<string, number> = {};

    deals.forEach((deal) => {
      const pipeline = deal.properties.pipeline;
      pipelineCounts[pipeline] = (pipelineCounts[pipeline] || 0) + 1;
    });

    let maxCount = 0;
    let maxPipeline = "";

    Object.entries(pipelineCounts).forEach(([pipeline, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxPipeline = pipeline;
      }
    });

    return maxPipeline;
  }, [deals]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPipeline, setSelectedPipeline] =
    useState<string>(mostDealsPipeline);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"column" | "list">("column");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the order of deal stages
  const dealStageOrder = useMemo(() => {
    // Complete System pipeline order
    const completeSystemOrder = [
      dealStage["1st meet: Info collection"],
      dealStage["2nd meet: Quote Presentation & Close"],
      dealStage["Follow-up #1 - Complete System"],
      dealStage["Follow-up #2 - Complete System"],
      dealStage["Closed Won - Complete System"],
      dealStage["Closed Lost - Complete System"],
    ];

    // Instant Quote pipeline order
    const instantQuoteOrder = [
      dealStage["Quote sent"],
      dealStage["Follow-up #1"],
      dealStage["Follow-Up #2"],
      dealStage["Closed Won"],
      dealStage["Closed Lost"],
    ];

    // Combine all orders
    return [...completeSystemOrder, ...instantQuoteOrder];
  }, []);

  // Get unique pipelines for filter
  const pipelines = useMemo(() => {
    const uniquePipelines = Array.from(
      new Set(deals.map((deal) => deal.properties.pipeline))
    );
    return uniquePipelines.map((pipeline) => ({
      value: pipeline,
      label: getPipelineLabel(pipeline),
    }));
  }, [deals]);

  // Filter deals based on search, pipeline, and time
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.properties.dealname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        deal.contacts.some((contact) =>
          `${contact.firstname} ${contact.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      const matchesPipeline = deal.properties.pipeline === selectedPipeline;

      const matchesTime = (() => {
        if (timeFilter === "all") return true;

        const progress = calculateDealProgress(
          deal.properties.createdate,
          deal.properties.closedate
        );

        if (timeFilter === "early" && progress < 30) return true;
        if (timeFilter === "mid" && progress >= 30 && progress < 70)
          return true;
        if (timeFilter === "late" && progress >= 70) return true;

        return false;
      })();

      return matchesSearch && matchesPipeline && matchesTime;
    });
  }, [deals, searchTerm, selectedPipeline, timeFilter]);

  // Group deals by stage and ending soon
  const groupedDeals = useMemo(() => {
    const groups: { [key: string]: Deal[] } = {};
    const endingSoon: Deal[] = [];

    filteredDeals.forEach((deal) => {
      if (isEndingSoon(deal.properties.closedate)) {
        endingSoon.push(deal);
      } else {
        const stage = deal.properties.dealstage;
        if (!groups[stage]) {
          groups[stage] = [];
        }
        groups[stage].push(deal);
      }
    });

    return { groups, endingSoon };
  }, [filteredDeals]);

  // Order the stage columns based on dealStageOrder
  const orderedStages = useMemo(() => {
    // Get all stages that have deals
    const stagesWithDeals = Object.keys(groupedDeals.groups);

    // Sort them according to the predefined order
    return dealStageOrder
      .filter((stageId) => stagesWithDeals.includes(stageId))
      .map((stageId) => ({
        stageId,
        deals: groupedDeals.groups[stageId],
        total: calculateTotal(groupedDeals.groups[stageId]),
      }));
  }, [groupedDeals.groups, dealStageOrder]);

  const Column = ({
    title,
    deals,
    total,
    isEndingSoon = false,
  }: {
    title: string;
    deals: Deal[];
    total: number;
    isEndingSoon?: boolean;
  }) => (
    <div className="flex-1 min-w-80">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{deals.length} deals</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto flex-grow">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Progress Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deals</SelectItem>
              <SelectItem value="early" className="flex items-center gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Early Stage</span>
                </div>
              </SelectItem>
              <SelectItem value="mid" className="flex items-center gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>Mid Stage</span>
                </div>
              </SelectItem>
              <SelectItem value="late" className="flex items-center gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Late Stage</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.value} value={pipeline.value}>
                  {pipeline.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "column" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("column")}
              className="rounded-r-none"
            >
              Column
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === "column" && (
        <div className="flex gap-6 overflow-x-auto pb-4  h-[calc(100vh-18rem)]">
          {/* Deal Stage Columns in Ordered Sequence */}
          {orderedStages.map(({ stageId, deals, total }) => (
            <Column
              key={stageId}
              title={getDealStageLabel(stageId)}
              deals={deals}
              total={total}
            />
          ))}

          {/* Ending Soon Column */}
          {groupedDeals.endingSoon.length > 0 && (
            <Column
              title="Ending Soon"
              deals={groupedDeals.endingSoon}
              total={calculateTotal(groupedDeals.endingSoon)}
              isEndingSoon={true}
            />
          )}
        </div>
      )}

      {/* List View (fallback) */}
      {viewMode === "list" && (
        <div className="grid gap-4">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onSelect={(id) => {
                setSelectedDealId(id);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* <DealModal
        dealId={selectedDealId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDealId(null);
        }}
      /> */}
    </div>
  );
};

export default DealsKanbanBoard;
