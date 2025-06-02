"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  FileText,
  Clock,
  Calendar,
  CheckSquare,
  Tag,
  TextSearch,
  Flag,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useCallback, useEffect, useMemo } from "react";
import { ContactModal } from "../Modals/Contact/ContactModal";
import { BorderBeam } from "../magicui/border-beam";
import { useRouter } from "next/navigation";
import { getPageNumbers } from "@/app/my-contacts/utils";
import { FilterCard, FilterState, FilterGroup } from "@/components/FilterCard";
import { getUserBatchTasks } from "@/actions/tasks/userBatchTasks";
import { Task } from "@/types/Tasks";

interface TasksTableProps {
  tasks: Task[];
  timeRange: "weekly" | "monthly" | "allTime";
  initialNextAfter?: string;
}

// Helper functions
const getTaskIcon = (type: string) => {
  switch (type) {
    case "CALL":
      return <Phone className="h-4 w-4" />;
    case "NOTE":
      return <FileText className="h-4 w-4" />;
    case "MEETING":
      return <Calendar className="h-4 w-4" />;
    case "TODO":
      return <CheckSquare className="h-4 w-4" />;
    default:
      return <CheckSquare className="h-4 w-4" />;
  }
};

const getTaskPriorityIcon = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return <Flag className="h-4 w-4 text-red-500" />;
    case "MEDIUM":
      return <Flag className="h-4 w-4 text-amber-500" />;
    case "LOW":
      return <Flag className="h-4 w-4 text-green-500" />;
    default:
      return <Flag className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    case "NOT_STARTED":
      return "secondary";
    default:
      return "outline";
  }
};

const truncateText = (text: string, maxLength: number = 120) => {
  if (!text) return "";
  const strippedText = text.replace(/<[^>]*>/g, "");
  return strippedText.length > maxLength
    ? `${strippedText.substring(0, maxLength)}...`
    : strippedText;
};

const getContactInitials = (task: Task) => {
  if (!task.contactsData?.[0]) return "?";

  const firstName = task.contactsData[0].properties.firstname || "";
  const lastName = task.contactsData[0].properties.lastname || "";

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getContactName = (task: Task) => {
  if (!task.contactsData?.[0]) return "Unknown Contact";

  const firstName = task.contactsData[0].properties.firstname || "";
  const lastName = task.contactsData[0].properties.lastname || "";

  return `${firstName} ${lastName}`.trim() || "Unknown Contact";
};

const getContactEmail = (task: Task) => {
  return task.contactsData?.[0]?.properties.email || "No email";
};

export function TasksTable({
  tasks: initialTasks,
  timeRange,
  initialNextAfter,
}: TasksTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Pagination & data loading
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!!initialNextAfter);
  const [nextAfter, setNextAfter] = useState(initialNextAfter);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    selectedFilters: {
      status: [],
      priority: [],
      type: [],
    },
    sortDesc: true,
  });

  const itemsPerPage = 10;

  // Load more tasks
  const loadMoreTasks = useCallback(async () => {
    if (isLoading || !hasMore || !nextAfter) return;

    setIsLoading(true);
    try {
      const result = await getUserBatchTasks(timeRange, nextAfter);

      if (result.tasks && result.tasks.length > 0) {
        setTasks((prev) => [...prev, ...result.tasks]);
        setNextAfter(result.nextAfter);
        setHasMore(!!result.nextAfter);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more tasks:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, nextAfter, isLoading, hasMore]);

  // Filter groups
  const filterGroups = useMemo<FilterGroup[]>(() => {
    const statuses = new Set<string>();
    const priorities = new Set<string>();
    const types = new Set<string>();

    tasks.forEach((task) => {
      statuses.add(task.properties.hs_task_status);
      priorities.add(task.properties.hs_task_priority);
      types.add(task.properties.hs_task_type);
    });

    return [
      {
        id: "status",
        label: "Status",
        icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
        options: Array.from(statuses).map((status) => ({
          value: status,
          label: status,
        })),
      },
      {
        id: "priority",
        label: "Priority",
        icon: <Flag className="h-4 w-4 text-muted-foreground" />,
        options: Array.from(priorities).map((priority) => ({
          value: priority,
          label: priority,
        })),
      },
      {
        id: "type",
        label: "Type",
        icon: <Tag className="h-4 w-4 text-muted-foreground" />,
        options: Array.from(types).map((type) => ({
          value: type,
          label: type,
        })),
      },
    ];
  }, [tasks]);

  // Handle filter changes
  const handleFilterChange = (newState: FilterState) => {
    setFilterState(newState);
    setCurrentPage(1);
  };

  // Processed tasks: search -> filters -> sort
  const processedTasks = useMemo(() => {
    const { searchQuery, selectedFilters, sortDesc } = filterState;

    let result = tasks.filter((task) => {
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return true;

      // Search by contact name, task subject, task body
      const contactName = getContactName(task).toLowerCase();
      const taskSubject = task.properties.hs_task_subject?.toLowerCase() || "";
      const taskBody = task.properties.hs_task_body?.toLowerCase() || "";
      const taskType = task.properties.hs_task_type?.toLowerCase() || "";

      return (
        contactName.includes(searchLower) ||
        taskSubject.includes(searchLower) ||
        taskBody.includes(searchLower) ||
        taskType.includes(searchLower)
      );
    });

    // Filter by status
    if (selectedFilters.status?.length > 0) {
      result = result.filter((task) =>
        selectedFilters.status.includes(task.properties.hs_task_status)
      );
    }

    // Filter by priority
    if (selectedFilters.priority?.length > 0) {
      result = result.filter((task) =>
        selectedFilters.priority.includes(task.properties.hs_task_priority)
      );
    }

    // Filter by type
    if (selectedFilters.type?.length > 0) {
      result = result.filter((task) =>
        selectedFilters.type.includes(task.properties.hs_task_type)
      );
    }

    // Sort by timestamp
    result.sort((a, b) => {
      const timeA = new Date(a.properties.hs_timestamp).getTime();
      const timeB = new Date(b.properties.hs_timestamp).getTime();
      return sortDesc ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [tasks, filterState]);

  // Pagination
  const totalPages = Math.ceil(processedTasks.length / itemsPerPage);
  const paginatedTasks = processedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto-load more when hitting last page
  useEffect(() => {
    if (currentPage === totalPages && hasMore && paginatedTasks.length > 0) {
      loadMoreTasks();
    }
  }, [currentPage, totalPages, hasMore, loadMoreTasks, paginatedTasks.length]);

  return (
    <div className="w-full">
      {/* Filter Card */}
      <FilterCard
        filterGroups={filterGroups}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search tasks..."
        resultCount={processedTasks.length}
        className="mb-4"
      />
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <TableRow key={task.id} className="group">
                  <TableCell
                    className="cursor-pointer relative overflow-hidden"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedLeadId(task?.contactsData?.[0]?.id || null);
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
                          {getContactInitials(task)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {getContactName(task)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getContactEmail(task)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium">
                        {truncateText(task.properties.hs_task_subject, 50)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {truncateText(task.properties.hs_task_body, 70)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTaskIcon(task.properties.hs_task_type)}
                      <span className="text-sm">
                        {task.properties.hs_task_type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTaskPriorityIcon(task.properties.hs_task_priority)}
                      <span className="text-sm">
                        {task.properties.hs_task_priority}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(
                          new Date(task.properties.hs_timestamp),
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
                        task.properties.hs_task_status
                      )}
                    >
                      {task.properties.hs_task_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {task?.contactsData?.[0]?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/contacts/${task?.contactsData?.[0].id}`
                            )
                          }
                        >
                          View Contact
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {filterState.searchQuery ||
                  Object.values(filterState.selectedFilters).some(
                    (arr) => arr.length > 0
                  )
                    ? "No matching tasks found"
                    : "No tasks available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */} {/* Pagination */}
      {processedTasks.length > 0 && (
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
    </div>
  );
}
