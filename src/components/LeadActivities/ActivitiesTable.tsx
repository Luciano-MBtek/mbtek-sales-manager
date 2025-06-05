"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Phone,
  Mail,
  FileText,
  Clock,
  Calendar,
  CheckSquare,
  Tag,
  TextSearch,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useCallback, useEffect, useMemo } from "react";
import { ContactModal } from "../Modals/Contact/ContactModal";
import { BorderBeam } from "../magicui/border-beam";
import { useRouter } from "next/navigation";
import {
  Engagement,
  getContactEmail,
  getContactInitials,
  getContactName,
  getEngagementSource,
  getEngagementStatus,
  getMessagePreview,
  getStatusBadgeVariant,
  truncateMessage,
} from "./utils";
import { getLeadsBatchActivities } from "@/actions/activities/leadsBatchActivities";
import { getPageNumbers } from "@/app/my-contacts/utils";
import { FilterCard, FilterState, FilterGroup } from "@/components/FilterCard";
import { TaskActionActivitiesMenu } from "./TaskACtionActivitiesMenu";
import ActivityModalBody from "./ActivityModalBody";

interface ActivitiesTableProps {
  activities: Engagement[];
  timeRange: "weekly" | "monthly" | "allTime";
  initialNextAfter?: string;
}

export const getEngagementIcon = (type: string) => {
  switch (type) {
    case "EMAIL":
      return <Mail className="h-4 w-4" />;
    case "CALL":
      return <Phone className="h-4 w-4" />;
    case "NOTE":
      return <FileText className="h-4 w-4" />;
    case "MEETING":
      return <Calendar className="h-4 w-4" />;
    case "TASK":
      return <CheckSquare className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function ActivitiesTable({
  activities: initialActivities,
  timeRange,
  initialNextAfter,
}: ActivitiesTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // pagination & data loading
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState(initialActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextAfter);
  const [nextAfter, setNextAfter] = useState(initialNextAfter);

  const [activityDetailOpen, setActivityDetailOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Engagement | null>(
    null
  );

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    selectedFilters: {
      status: [],
      source: [],
    },
    sortDesc: true,
  });

  const itemsPerPage = 10;

  // Load more activities ----------------------------------------------------
  const loadMoreActivities = useCallback(async () => {
    if (isLoading || !hasMore || !nextAfter) return;

    setIsLoading(true);
    try {
      const result = await getLeadsBatchActivities(timeRange, nextAfter);

      if (result.engagements && result.engagements.length > 0) {
        setActivities((prev) => [...prev, ...result.engagements]);
        setNextAfter(result.nextAfter);
        setHasMore(!!result.nextAfter);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more activities:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, nextAfter, isLoading, hasMore]);

  // Unique status and source lists as Options for FilterGroups ---------
  const filterGroups = useMemo<FilterGroup[]>(() => {
    const statuses = new Set<string>();
    const sources = new Set<string>();

    activities.forEach((a) => {
      statuses.add(getEngagementStatus(a));
      sources.add(getEngagementSource(a));
    });

    return [
      {
        id: "status",
        label: "Status",
        icon: <Tag className="h-4 w-4 text-muted-foreground" />,
        options: Array.from(statuses).map((status) => ({
          value: status,
          label: status,
        })),
      },
      {
        id: "source",
        label: "Source",
        icon: <TextSearch className="h-4 w-4 text-muted-foreground" />,
        options: Array.from(sources).map((source) => ({
          value: source,
          label: source,
        })),
      },
    ];
  }, [activities]);

  // Handle filter changes
  const handleFilterChange = (newState: FilterState) => {
    setFilterState(newState);
    setCurrentPage(1);
  };

  // Processed activities: search -> filters -> sort -------------------------
  // Processed activities: search -> filters -> sort -------------------------
  const processedActivities = useMemo(() => {
    const { searchQuery, selectedFilters, sortDesc } = filterState;

    let result = activities.filter((activity) => {
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return true;

      // Search by contact name, message content or engagement type
      const contactName = getContactName(activity).toLowerCase();
      const messageContent = getMessagePreview(activity).toLowerCase();
      const engagementType =
        activity.properties.hs_engagement_type.toLowerCase();

      return (
        contactName.includes(searchLower) ||
        messageContent.includes(searchLower) ||
        engagementType.includes(searchLower)
      );
    });

    // Filter by status (multiple)
    if (selectedFilters.status?.length > 0) {
      result = result.filter((a) =>
        selectedFilters.status.includes(getEngagementStatus(a))
      );
    }

    // Filter by source (multiple)
    if (selectedFilters.source?.length > 0) {
      result = result.filter((a) =>
        selectedFilters.source.includes(getEngagementSource(a))
      );
    }

    // Sort by time
    result.sort((a, b) => {
      const timeA = new Date(a.properties.hs_timestamp).getTime();
      const timeB = new Date(b.properties.hs_timestamp).getTime();
      return sortDesc ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [activities, filterState]);

  // Pagination --------------------------------------------------------------
  const totalPages = Math.ceil(processedActivities.length / itemsPerPage);
  const paginatedActivities = processedActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto‑load more when hitting last page -----------------------------------
  useEffect(() => {
    if (
      currentPage === totalPages &&
      hasMore &&
      paginatedActivities.length > 0
    ) {
      loadMoreActivities();
    }
  }, [
    currentPage,
    totalPages,
    hasMore,
    loadMoreActivities,
    paginatedActivities.length,
  ]);

  // UI ----------------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Using the reusable FilterCard component */}
      <FilterCard
        filterGroups={filterGroups}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search activities..."
        resultCount={processedActivities.length}
        className="mb-4"
      />

      {/* Table ----------------------------------------------------------------*/}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedActivities.length > 0 ? (
              paginatedActivities.map((activity) => (
                <TableRow key={activity.id} className="group">
                  <TableCell
                    className="cursor-pointer relative overflow-hidden"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedLeadId(
                        activity?.contactsData?.[0]?.id || null
                      );
                    }}
                  >
                    <BorderBeam
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      size={100}
                      duration={5}
                      initialOffset={20}
                      colorFrom="#0ea5e9"
                      colorTo="#6366f1"
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                      }}
                    />
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getContactInitials(activity)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {getContactName(activity)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getContactEmail(activity)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedActivity(activity);
                      setActivityDetailOpen(true);
                    }}
                  >
                    <div className="max-w-xs">
                      <div className="text-sm">
                        {truncateMessage(getMessagePreview(activity))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getEngagementIcon(
                        activity.properties.hs_engagement_type
                      )}
                      <span className="text-sm">
                        {getEngagementSource(activity)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(
                          new Date(activity.properties.hs_timestamp),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(
                        getEngagementStatus(activity)
                      )}
                    >
                      {getEngagementStatus(activity)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TaskActionActivitiesMenu engagement={activity} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {filterState.searchQuery ||
                  Object.values(filterState.selectedFilters).some(
                    (arr) => arr.length > 0
                  )
                    ? "No matching activities found"
                    : "No activities available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination ----------------------------------------------------------*/}
      {processedActivities.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers(currentPage, totalPages).map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`cursor-pointer ${
                  (currentPage === totalPages && !hasMore) || isLoading
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                ${isLoading ? "animate-pulse" : ""}
              `}
              >
                {isLoading ? "Loading..." : "Next"}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modal */}
      <ContactModal
        contactId={selectedLeadId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ActivityModalBody
        activityDetailOpen={activityDetailOpen}
        setActivityDetailOpen={setActivityDetailOpen}
        selectedActivity={selectedActivity}
      />
    </div>
  );
}
