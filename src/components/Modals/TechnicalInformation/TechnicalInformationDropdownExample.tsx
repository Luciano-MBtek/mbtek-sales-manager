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
import { DealModal } from "@/components/Modals/Deal/DealModal";
import { useState } from "react";
interface TechnicalInformationDropdownExampleProps {
  contactId: string;
  dealId: string;
}

export function TechnicalInformationDropdownExample({
  contactId,
  dealId,
}: TechnicalInformationDropdownExampleProps) {
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenDealModal = () => {
    setIsDropdownOpen(false);
    setIsDealModalOpen(true);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleOpenDealModal}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Details</span>
          </DropdownMenuItem>

          <TechnicalInformationDropdownItem dealId={dealId}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Technical Information</span>
          </TechnicalInformationDropdownItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DealModal
        dealId={dealId}
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />
    </>
  );
}
