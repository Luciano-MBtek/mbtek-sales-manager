"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/StepIndicator";
import BuildingNeedsContent from "./BuildingNeedsContent";
import ZonesInformationContent from "./ZonesInformationContent";
import DocumentationContent from "./DocumentationContent";
import QuoteBillingContent from "./QuoteBillingContent";
import ShippingContent from "./ShippingContent";
import { useToast } from "@/components/ui/use-toast";

type TechnicalStep =
  | "building-needs"
  | "step-2"
  | "step-3"
  | "step-4"
  | "step-5";

const STEPS: Array<{ id: TechnicalStep; label: string }> = [
  { id: "building-needs", label: "Building needs" },
  { id: "step-2", label: "Step 2" },
  { id: "step-3", label: "Step 3" },
  { id: "step-4", label: "Step 4" },
  { id: "step-5", label: "Step 5" },
];

interface TechnicalInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechnicalInformationModal({
  isOpen,
  onClose,
}: TechnicalInformationModalProps) {
  const [currentStep, setCurrentStep] =
    useState<TechnicalStep>("building-needs");
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  const handleBack = () => {
    if (currentStepIndex === 0) {
      onClose();
    } else {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleContinue = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleStepComplete = async (stepData: any) => {
    setIsSaving(true);
    try {
      // Here goes the logic to save the data
      console.log("Step data:", stepData);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentStep]: stepData,
      }));

      // Show success message
      toast({
        title: "Step completed",
        description: "Information has been saved successfully.",
      });

      // Move to next step if not in last step
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentStepIndex + 1].id);
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "There was an error saving the information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "building-needs":
        return (
          <BuildingNeedsContent
            onComplete={handleStepComplete}
            initialData={formData[currentStep]}
            formRef={formRef}
          />
        );
      case "step-2":
        return (
          <ZonesInformationContent
            onComplete={handleStepComplete}
            initialData={formData[currentStep]}
            formRef={formRef}
          />
        );
      case "step-3":
        return (
          <DocumentationContent
            onComplete={handleStepComplete}
            initialData={formData[currentStep]}
            formRef={formRef}
          />
        );
      case "step-4":
        return (
          <QuoteBillingContent
            onComplete={handleStepComplete}
            initialData={formData[currentStep]}
            formRef={formRef}
          />
        );
      case "step-5":
        return (
          <ShippingContent
            onComplete={handleStepComplete}
            initialData={formData[currentStep]}
            formRef={formRef}
          />
        );
      default:
        return <p>Step under construction: {currentStep}</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-[#0f172a] text-white p-4 -mx-6 -mt-6">
            Deal - Information Collection
          </DialogTitle>
        </DialogHeader>

        <StepIndicator
          steps={STEPS.length}
          currentStep={currentStepIndex + 1}
          labels={STEPS.map((step) => step.label)}
        />

        {/* Step content */}
        <div className="py-4">
          <div className="mb-6">
            <h2 className="text-lg font-medium">
              Step {currentStepIndex + 1}: {STEPS[currentStepIndex].label}
            </h2>
          </div>
          {renderStepContent()}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-[100px]"
            disabled={isSaving}
          >
            {currentStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={handleContinue}
            className="w-[100px] bg-[#0f172a]"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
