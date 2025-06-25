"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Settings } from "lucide-react";
import { TechnicalInformationDropdownItem } from "./TechnicalInformationDropdownItem";

interface TechnicalInformationDropdownExampleProps {
  contactId: string;
  dealId: string;
}

export function TechnicalInformationDropdownExample({
  contactId,
  dealId,
}: TechnicalInformationDropdownExampleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <TechnicalInformationDropdownItem contactId={contactId} dealId={dealId}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Technical Information</span>
        </TechnicalInformationDropdownItem>

        <DropdownMenuItem>
          <span>Other option</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
