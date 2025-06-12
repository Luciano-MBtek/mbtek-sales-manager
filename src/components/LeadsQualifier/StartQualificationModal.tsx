"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QualificationModal } from "@/components/Modals/LeadQualification/QualificationModal";
import { useQualificationStore } from "@/store/qualification-store";

export default function StartQualificationModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetData, setStep } = useQualificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shouldOpen = searchParams.get("startQualification");
    if (shouldOpen) {
      resetData();
      setStep("step-one");
      setOpen(true);
    }
  }, [searchParams, resetData, setStep]);

  const handleClose = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("startQualification");
    const query = params.toString();
    const url = query ? `/active-qualifications?${query}` : "/active-qualifications";
    router.replace(url);
  };

  return (
    <QualificationModal isOpen={open} onClose={handleClose} />
  );
}
