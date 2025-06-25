"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TechnicalInformationModal } from "./TechnicalInformationModal";

interface TechnicalInformationDropdownItemProps {
  dealId: string;
  children?: React.ReactNode;
  className?: string;
  onDropdownOpenChange?: (open: boolean) => void;
}

export function TechnicalInformationDropdownItem({
  dealId,
  children = "Technical Information",
  className,
  onDropdownOpenChange,
}: TechnicalInformationDropdownItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    // Cerrar el dropdown cuando se abre el modal
    if (onDropdownOpenChange) {
      onDropdownOpenChange(false);
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
        }}
        onClick={handleOpenModal}
        className={className}
      >
        {children}
      </DropdownMenuItem>

      <TechnicalInformationModal
        isOpen={isModalOpen}
        // onClose={() => setIsModalOpen(false)}
        dealId={dealId}
      />
    </>
  );
}
