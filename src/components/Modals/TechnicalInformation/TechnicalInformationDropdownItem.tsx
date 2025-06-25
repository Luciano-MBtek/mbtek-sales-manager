"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TechnicalInformationModal } from "./TechnicalInformationModal";
import { GetContactById } from "@/actions/getContactById";
import { getDealById } from "@/actions/deals/getDealsById";
import { getFilesById } from "@/actions/deals/getFilesById";
import { useToast } from "@/components/ui/use-toast";

interface TechnicalInformationDropdownItemProps {
  contactId: string;
  dealId: string;
  children?: React.ReactNode;
  className?: string;
}

export function TechnicalInformationDropdownItem({
  contactId,
  dealId,
  children = "Technical Information",
  className,
}: TechnicalInformationDropdownItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactData, setContactData] = useState<any>(null);
  const [dealData, setDealData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const handleOpenModal = async () => {
    setIsLoading(true);
    try {
      const contact = await GetContactById(contactId, true);
      const deal = await getDealById(dealId, true);
      let files: any[] = [];

      if (deal?.properties.complete_system_documentation) {
        const { results } = await getFilesById(
          deal?.properties.complete_system_documentation.split(";")
        );
        files = results;
      }

      setContactData(contact);
      setDealData(deal);
      setFiles(files);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Could not load contact or deal information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={handleOpenModal}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? "Loading..." : children}
      </DropdownMenuItem>

      <TechnicalInformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactData={contactData}
        dealData={dealData}
        files={files}
      />
    </>
  );
}
