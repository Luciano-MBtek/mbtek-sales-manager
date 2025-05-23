"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TechnicalInformationModal } from "@/components/Modals/TechnicalInformation/TechnicalInformationModal";

export default function TestModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        Technical Information Collection
      </h1>
      <Button onClick={() => setIsModalOpen(true)}>
        Start Technical Information Collection
      </Button>
      <TechnicalInformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
