"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import StepOneContent from "./StepOneContent";
import { StepIndicator } from "@/components/StepIndicator";
import {
  useQualificationStore,
  type QualificationData,
  stepTitles,
} from "@/store/qualification-store";
import { useRouter } from "next/navigation";
import StepTwoContent from "./StepTwoContent";
import StepThreeContent from "./StepThreeContent";
import StepFourContent from "./StepFourContent";
import StepFiveContent from "./stepFiveContent";
import ReviewContent from "./ReviewContent";
import { Loader2, Trash, BrushCleaning } from "lucide-react";
import {
  handleStepComplete as handleStepCompleteFunc,
  getPreviousStep,
  stepLabels,
  getCurrentStepNumber,
  type StepProcessingDependencies,
  processStepData,
} from "./handleStepComplete";

import DisqualificationContent from "./DisqualificationContent";
import MeetingModal from "./MeetingModal";
import { MeetingLink } from "@/actions/hubspot/meetings/getMeetingsLink";
import { useMeetingLink } from "@/hooks/useMeetingLink";

// Modal component
interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QualificationModal({
  isOpen,
  onClose,
}: QualificationModalProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    data,
    currentStep,
    updateData,
    setStep,
    completeStep,
    setPreviousStep,
    previousStep,
    setHasChanges,
    resetData,
    resetVersion,
  } = useQualificationStore();
  const [isSaving, setIsSaving] = useState(false);
  const [currentBantTotal, setCurrentBantTotal] = useState<number | null>(null);
  const { meetingLink, isLoading: isMeetingLinkLoading } = useMeetingLink(
    data.ownerId
  );

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // When resetVersion changes, we can force reset the form if it exists
    if (formRef.current) {
      console.log("Form reset triggered by resetVersion change:", resetVersion);
      // This is a hack to reset the React Hook Form state
      formRef.current.reset?.();
    }
  }, [resetVersion]);

  // Create dependencies object for step handling
  const stepDependencies: StepProcessingDependencies = {
    updateData,
    setStep,
    completeStep,
    toast,
    onClose,
    router,
    setIsSaving,
    data,
    previousStep,
    setHasChanges,
    resetData,
  };

  const handleStepComplete = async (stepData: Partial<QualificationData>) => {
    console.log("STEP Meeting DATA:", stepData);

    /* 
      {
    "meetingBookSucceeded": true,
    "meetingsPayload": {
        "linkType": "PERSONAL_LINK",
        "offline": false,
        "userSlug": "luciano-emilio",
        "formGuid": "c92db5fd-0d7d-4b91-93f4-2fe071611c2b",
        "bookingResponse": {
            "event": {
                "bookingTimeConflictStatus": false,
                "dateString": "2025-05-22",
                "dateTime": 1747927800000,
                "duration": 900000,
                "formFields": []
            },
            "postResponse": {
                "timerange": {
                    "start": 1747927800000,
                    "end": 1747928700000
                },
                "organizer": {
                    "firstName": "Luciano Emilio",
                    "lastName": "Pérez",
                    "email": "",
                    "fullName": "",
                    "name": "Luciano Emilio Pérez",
                    "userId": null
                },
                "bookedOffline": false,
                "contact": {
                    "firstName": "Luciano",
                    "lastName": "Emilio Perez",
                    "email": "info.luciano.design@gmail.com",
                    "fullName": "",
                    "name": "Luciano Emilio Perez",
                    "userId": null
                }
            }
        },
        "isPaidMeeting": false
    }
}
    */
    await handleStepCompleteFunc(stepData, currentStep, stepDependencies);
  };

  const handleDisqualify = () => {
    if (!data.contactId) {
      toast({
        title: "Error",
        description: "Contact ID not found",
        variant: "destructive",
      });
      return;
    }

    setPreviousStep(currentStep);

    setStep("disqualified");

    setHasChanges(true);
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      if (!data.contactId) {
        toast({
          title: "Error",
          description: "Contact ID not found",
          variant: "destructive",
        });
        return;
      }

      // Process current step data
      if (formRef.current) {
        formRef.current.requestSubmit();

        // Allow time for the form submission to process
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Save the current state to the backend
      await processStepData(currentStep, data, stepDependencies);

      toast({
        title: "Success",
        description: "Progress saved successfully",
      });

      // Reset and close
      resetData();
      onClose();
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    resetData();

    if (formRef.current) {
      formRef.current.reset?.();
    }

    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
    });
  };

  // Render current step content with key prop based on resetVersion
  const renderStepContent = () => {
    switch (currentStep) {
      case "step-one":
        return (
          <StepOneContent
            key={`step-one-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );
      case "step-two":
        return (
          <StepTwoContent
            key={`step-two-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );
      case "step-three":
        return (
          <StepThreeContent
            key={`step-three-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );

      case "step-four":
        return (
          <StepFourContent
            key={`step-four-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );

      case "step-five":
        return (
          <StepFiveContent
            key={`step-five-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );

      case "review":
        return (
          <ReviewContent
            key={`review-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
            onBantScoreChange={(score) => setCurrentBantTotal(score.total)}
          />
        );

      case "meeting":
        return (
          <MeetingModal
            key={`meeting-${resetVersion}`}
            onComplete={handleStepComplete}
            //formRef={formRef}
            meetingLink={meetingLink ?? ({} as MeetingLink)}
            contactEmail={data.email}
            contactFirstName={data.name}
            contactLastName={data.lastname}
          />
        );

      case "disqualified":
        return (
          <DisqualificationContent
            key={`disqualified-${resetVersion}`}
            onComplete={handleStepComplete}
            initialData={data}
            formRef={formRef}
          />
        );
      default:
        return <div>Step not implemented yet</div>;
    }
  };

  const handleContinue = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === "step-one") {
      onClose();
    } else {
      const prevStep = getPreviousStep(currentStep, previousStep);
      if (prevStep) {
        setStep(prevStep);
        // Reset hasChanges when navigating back
        setHasChanges(false);
        if (currentStep === "disqualified") {
          setPreviousStep(null); // Clear previousStep when leaving disqualification
        }
      }
    }
  };

  const shouldShowStepIndicator = currentStep !== "disqualified";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-semibold">
            {stepTitles[currentStep]}
            <Button
              className="flex gap-1 mr-10"
              variant="warning"
              onClick={handleResetForm}
            >
              <BrushCleaning />
              <span>Reset form</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        {shouldShowStepIndicator && (
          <StepIndicator
            steps={7}
            currentStep={getCurrentStepNumber(currentStep)}
            labels={stepLabels}
          />
        )}

        {renderStepContent()}

        <div className="mt-4 flex justify-between  bg-white pb-4">
          <div className="flex gap-2">
            {/* Only show disqualify button after step one, if we have a contact ID, and we're not in disqualification step */}
            {currentStep !== "step-one" &&
              currentStep !== "disqualified" &&
              data.contactId && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleDisqualify}
                    disabled={isSaving}
                  >
                    <span className="flex gap-2 items-center">
                      Disqualify
                      <Trash className="h-4 w-4" />
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                  >
                    <span className="flex gap-2 items-center">
                      Save Progress
                    </span>
                  </Button>
                </>
              )}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-[200px]"
            >
              {currentStep === "step-one" ? "Cancel" : "Back"}
            </Button>
            <Button
              onClick={handleContinue}
              className={`w-[200px] ${currentStep === "review" ? "bg-green-500" : ""}`}
              disabled={
                isSaving ||
                (currentStep === "review" &&
                  (currentBantTotal !== null ? currentBantTotal < 50 : false))
              }
              variant={
                currentStep === "disqualified" ? "destructive" : "default"
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep === "disqualified" ? (
                "Confirm Disqualification"
              ) : currentStep === "review" ? (
                "Qualify"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
