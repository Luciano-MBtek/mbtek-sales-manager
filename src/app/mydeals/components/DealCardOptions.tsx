"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, FileText } from "lucide-react";
import { TechnicalInformationModal } from "@/components/Modals/TechnicalInformation/TechnicalInformationModal";
import { DealModal } from "@/components/Modals/Deal/DealModal";
import DealLostModal from "@/components/Modals/Deal/DealLostModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface DealCardOptions {
  contactId: string;
  dealId: string;
  dealPipeline: string;
}

export function DealCardOptions({
  contactId,
  dealId,
  dealPipeline,
}: DealCardOptions) {
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTechnicalInfoModalOpen, setIsTechnicalInfoModalOpen] =
    useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenDealModal = () => {
    setIsDropdownOpen(false);
    setIsDealModalOpen(true);
  };

  const handleOpenTechnicalInfoModal = () => {
    setIsDropdownOpen(false);
    setIsTechnicalInfoModalOpen(true);
  };

  const handleOpenLostModal = () => {
    setIsDropdownOpen(false);
    setIsLostModalOpen(true);
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
            <Eye className="mr-2 h-4 w-4" />
            <span>Details</span>
          </DropdownMenuItem>

          {dealPipeline === "732661879" && (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={handleOpenTechnicalInfoModal}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Technical Information</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleOpenLostModal}
          >
            <span>Mark as Lost</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-center bg-black text-white"
            onSelect={(e) => {
              e.preventDefault();
              router.push(`/contacts/${contactId}`);
            }}
          >
            Open Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DealModal
        dealId={dealId}
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
      />

      <TechnicalInformationModal
        isOpen={isTechnicalInfoModalOpen}
        onClose={() => setIsTechnicalInfoModalOpen(false)}
        dealId={dealId}
      />

      <DealLostModal
        isOpen={isLostModalOpen}
        onClose={() => setIsLostModalOpen(false)}
        dealId={dealId}
        pipeline={dealPipeline}
      />
    </>
  );
}
