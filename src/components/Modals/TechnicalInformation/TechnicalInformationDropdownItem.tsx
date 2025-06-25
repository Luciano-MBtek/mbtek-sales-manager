"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TechnicalInformationModal } from "./TechnicalInformationModal";

interface TechnicalInformationDropdownItemProps {
  dealId: string;
  children?: React.ReactNode;
  className?: string;
}

export function TechnicalInformationDropdownItem({
  dealId,
  children = "Technical Information",
  className,
}: TechnicalInformationDropdownItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={className}
      >
        {children}
      </DropdownMenuItem>

      <TechnicalInformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dealId={dealId}
      />
    </>
  );
}
