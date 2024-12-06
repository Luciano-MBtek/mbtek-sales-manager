"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { propertyNameMap } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Card } from "../ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "step", desc: false },
  ]);

  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);
  const [filterText, setFilterText] = useState("");

  const uniqueSteps = useMemo(() => {
    return Array.from(
      new Set(Object.values(propertyNameMap).map((item) => item.step))
    ).sort();
  }, []);

  // Calcula los filtros de columna basados en selectedSteps y filterText
  const columnFilters = useMemo(() => {
    const filters = [];
    if (selectedSteps.length > 0) {
      filters.push({ id: "step", value: selectedSteps });
    }
    if (filterText) {
      filters.push({ id: "friendlyName", value: filterText });
    }
    return filters;
  }, [selectedSteps, filterText]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const stepMap: Record<number, string> = {
    1: "Discovery Call",
    2: "Lead Qualification",
    3: "Data Collection 1",
    4: "Complete System",
    5: "Schematic Request",
  };

  return (
    <div className="w-[95%]">
      <div className="flex flex-col items-center py-4 justify-between gap-4">
        <Input
          placeholder="Filter Properties..."
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          className="w-full"
        />

        <Card className=" w-full rounded-md border p-4">
          <div className="flex flex-wrap gap-4">
            {uniqueSteps.map((step) => (
              <div key={step} className="flex items-center space-x-2">
                <Checkbox
                  id={`step-${step}`}
                  checked={selectedSteps.includes(step)}
                  onCheckedChange={(checked) => {
                    setSelectedSteps((prev) =>
                      checked ? [...prev, step] : prev.filter((s) => s !== step)
                    );
                  }}
                />
                <Label htmlFor={`step-${step}`}>{stepMap[step]}</Label>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
