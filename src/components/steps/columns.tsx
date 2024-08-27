"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

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
      const { property } = row.original;
      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(property)}
              >
                Copy property
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>Modify property</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
