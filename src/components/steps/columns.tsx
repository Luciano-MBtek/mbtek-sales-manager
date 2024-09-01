"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import DropDownTable from "../DropDownTable";

export type Properties = {
  friendlyName: string;
  property: string;
  value: string;
  step: number;
};

export const columns: ColumnDef<Properties>[] = [
  {
    accessorKey: "step",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <h2 className="font-bold">Step</h2>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, id, filterValue: number[]) => {
      if (!filterValue.length) return true;
      return filterValue.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "friendlyName",
    header: ({ column }) => {
      return <h2 className="font-bold">Name</h2>;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return <h2 className="font-bold">Value</h2>;
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <h2 className="font-bold">Actions</h2>
        </div>
      );
    },
    cell: ({ row }) => {
      const { property, value, friendlyName } = row.original;
      return (
        <div className="flex items-center justify-end">
          <DropDownTable
            property={property}
            value={value}
            friendlyName={friendlyName}
          />
        </div>
      );
    },
  },
];
