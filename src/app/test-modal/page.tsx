"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TechnicalInformationModal } from "@/components/Modals/TechnicalInformation/TechnicalInformationModal";
import { GetContactById } from "@/actions/getContactById";
import { getDealById } from "@/actions/deals/getDealsById";

export default function TestModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactData, setContactData] = useState<any>(null);
  const [dealData, setDealData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = async () => {
    setIsLoading(true);
    try {
      const contact = await GetContactById("98549658715");
      const deal = await getDealById("37904619579");
      setContactData(contact);
      setDealData(deal);
      setIsModalOpen(true);

      console.log("Contact data:", contact);
      console.log("Deal data:", deal);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        Technical Information Collection
      </h1>
      <Button onClick={handleOpenModal} disabled={isLoading}>
        {isLoading ? "Loading..." : "Start Technical Information Collection"}
      </Button>
      <TechnicalInformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactData={contactData}
        dealData={dealData}
      />
    </div>
  );
}
