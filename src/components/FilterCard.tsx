"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  SortDesc,
  SortAsc,
  X,
  ChevronDown,
} from "lucide-react";

// Define types for filter options
export type FilterOption = {
  value: string;
  label: string;
};

// Define types for filter groups
export type FilterGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
};

export type FilterState = {
  searchQuery: string;
  selectedFilters: Record<string, string[]>;
  sortDesc: boolean;
};

type FilterCardProps = {
  filterGroups: FilterGroup[];
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  searchPlaceholder?: string;
  resultCount?: number;
  className?: string;
};

export function FilterCard({
  filterGroups,
  filterState,
  onFilterChange,
  searchPlaceholder = "Search...",
  resultCount,
  className = "",
}: FilterCardProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Helper functions
  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filterState,
      searchQuery: value,
    });
  };

  const handleFilterChange = (
    groupId: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filterState.selectedFilters[groupId] || [];

    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    onFilterChange({
      ...filterState,
      selectedFilters: {
        ...filterState.selectedFilters,
        [groupId]: newValues,
      },
    });
  };

  const handleSortToggle = () => {
    onFilterChange({
      ...filterState,
      sortDesc: !filterState.sortDesc,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      ...filterState,
      searchQuery: "",
      selectedFilters: {},
    });
  };

  // Calculate active filters count
  const activeFiltersCount = Object.values(filterState.selectedFilters).reduce(
    (count, filters) => count + filters.length,
    0
  );

  const hasActiveFilters = activeFiltersCount > 0 || !!filterState.searchQuery;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row: Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={filterState.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {filterState.searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Sort Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSortToggle}
                className="flex items-center gap-2"
              >
                {filterState.sortDesc ? (
                  <SortDesc className="h-4 w-4" />
                ) : (
                  <SortAsc className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {filterState.sortDesc ? "Newest" : "Oldest"}
                </span>
              </Button>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Filter Section */}
          {showFilters && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {group.icon}
                      <span className="text-sm font-medium">{group.label}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {(filterState.selectedFilters[group.id]?.length ??
                            0) > 0
                            ? `${filterState.selectedFilters[group.id]?.length} selected`
                            : `Select ${group.label.toLowerCase()}...`}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                          Filter by {group.label}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {group.options.map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={
                              filterState.selectedFilters[group.id]?.includes(
                                option.value
                              ) ?? false
                            }
                            onCheckedChange={(checked) =>
                              handleFilterChange(
                                group.id,
                                option.value,
                                checked
                              )
                            }
                          >
                            {option.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filterState.searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {`Search: ${filterState.searchQuery}`}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchChange("")}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filterGroups.map((group) =>
                  (filterState.selectedFilters[group.id] || []).map((value) => {
                    const option = group.options.find((o) => o.value === value);
                    return (
                      <Badge
                        key={`${group.id}-${value}`}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {`${group.label}: ${option?.label || value}`}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleFilterChange(group.id, value, false)
                          }
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Results Summary */}
          {resultCount !== undefined && filterState.searchQuery && (
            <div className="text-sm text-muted-foreground">
              Found {resultCount} results
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
