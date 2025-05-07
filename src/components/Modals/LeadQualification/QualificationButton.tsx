// src/components/QualificationButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QualificationModal } from "@/components/Modals/LeadQualification/QualificationModal";

export default function QualificationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Start new Qualification
      </Button>
      <QualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
