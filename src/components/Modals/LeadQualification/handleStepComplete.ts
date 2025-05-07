import { createOrModify } from "@/actions/qualification/createOrModifyLead";
import { useQualificationStore } from "@/store/qualification-store";
import {
  QualificationData,
  QualificationStep,
  stepTitles,
} from "@/store/qualification-store";
import {
  disqualifiedLeadFormValues,
  ReviewQualificationFormValues,
  StepQualificationFiveFormValues,
  StepQualificationFourFormValues,
  StepQualificationOneFormValues,
  StepQualificationThreeFormValues,
  StepQualificationTwoFormValues,
} from "@/schemas/leadQualificationSchema";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { patchContactProperties } from "@/actions/patchContactProperties";
import {
  createContactPropertiesReview,
  createContactPropertiesStep2,
  createContactPropertiesStep3,
  createContactPropertiesStep4,
  createContactPropertiesStep5,
  createDisqualifyProperties,
} from "@/lib/utils";

// Interface for step processing dependencies
export interface StepProcessingDependencies {
  updateData: (newData: Partial<QualificationData>) => void;
  setStep: (step: QualificationStep) => void;
  completeStep: (step: QualificationStep) => void;
  toast: any;
  onClose: () => void;
  router: AppRouterInstance;
  setIsSaving: (value: boolean) => void;
  data: QualificationData;
  previousStep?: QualificationStep | null;
  setHasChanges?: (value: boolean) => void;
  resetData?: () => void;
}

// Main handler function
export const handleStepComplete = async (
  stepData: Partial<QualificationData>,
  currentStep: QualificationStep,
  deps: StepProcessingDependencies
) => {
  const { updateData, setIsSaving, toast, setHasChanges, resetData } = deps;

  setIsSaving(true);

  try {
    // Update local store - IMPORTANT: Add a direct force flag for critical steps
    const forceProcess =
      currentStep === "step-one" || currentStep === "disqualified";

    // Instead of using the updateData from deps, directly access the store
    // to get real-time hasChanges state
    updateData(stepData);

    // Get the current hasChanges state directly from the store
    const currentHasChanges = useQualificationStore.getState().hasChanges;

    console.log("Current has changes from store:", currentHasChanges);

    // Process step data only when needed
    const shouldProcessStep = currentHasChanges || forceProcess;

    console.log(
      "Should process step:",
      shouldProcessStep,
      "for step:",
      currentStep
    );

    if (shouldProcessStep) {
      await processStepData(currentStep, stepData, deps);
    }

    // Mark step as complete
    deps.completeStep(currentStep);

    // Reset hasChanges flag after processing
    if (setHasChanges) {
      setHasChanges(false);
    }

    // Determine and set next step
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      deps.setStep(nextStep);
      // Only show toast if we actually saved data
      if (shouldProcessStep) {
        toast({
          title: "Step Completed",
          description: `Successfully saved ${stepTitles[currentStep]}`,
        });
      } else {
        // For steps with no changes, just show a simpler message
        toast({
          title: "Moving Forward",
          description: `Proceeding to next step: ${stepTitles[nextStep]}`,
        });
      }
    } else {
      // Reset the store when the review step is completed (last step)
      if (resetData && currentStep === "review") {
        resetData();
      }
      if (resetData && currentStep === "disqualified") {
        resetData();
      }

      // Handle completion
      toast({
        title: "Success",
        description: "Qualification process completed successfully",
      });
      deps.onClose();
    }
  } catch (error) {
    console.error("Error saving step data:", error);
    toast({
      title: "Error",
      description: "Failed to save data. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};

// Handle step-specific data processing
export const processStepData = async (
  step: QualificationStep,
  stepData: Partial<QualificationData>,
  deps: StepProcessingDependencies
): Promise<boolean> => {
  const { router, onClose, updateData, data, resetData } = deps;

  switch (step) {
    case "step-one":
      // Handle contact creation
      const newContact = await createOrModify(
        stepData as StepQualificationOneFormValues
      );

      if (!newContact.success) {
        throw new Error(newContact.errorMsg);
      }

      const contactId = newContact.contactId;

      if (contactId) {
        updateData({ contactId: contactId });
      }

      // Handle redirect for single products quote
      if (stepData.lookingFor === "single_products_quote" && contactId) {
        // Reset the store when redirecting to single product quote
        if (resetData) {
          resetData();
        }
        onClose();
        router.push(
          `/contacts/${contactId}?redirect=/forms/single-product/step-one`
        );
        return false;
      }
      break;

    case "step-two":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createContactPropertiesStep2(stepData as StepQualificationTwoFormValues)
      );
      break;

    case "step-three":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createContactPropertiesStep3(
          stepData as StepQualificationThreeFormValues
        )
      );
      break;

    case "step-four":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createContactPropertiesStep4(
          stepData as StepQualificationFourFormValues
        )
      );
      break;

    case "step-five":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createContactPropertiesStep5(
          stepData as StepQualificationFiveFormValues
        )
      );
      break;

    case "review":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createContactPropertiesReview(stepData as ReviewQualificationFormValues)
      );
      break;
    case "disqualified":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createDisqualifyProperties(stepData as disqualifiedLeadFormValues)
      );

      console.log("Must Reset");
      if (resetData) {
        console.log("Executing resetData()");
        resetData();
      }

      // Pequeño retraso para asegurar que resetData se completa
      setTimeout(() => {
        onClose();
      }, 100);
      break;
  }

  return true;
};

// Determine the next step based on current step
export const getNextStep = (
  currentStep: QualificationStep
): QualificationStep | null => {
  const stepSequence: QualificationStep[] = [
    "step-one",
    "step-two",
    "step-three",
    "step-four",
    "step-five",
    "review",
  ];

  const currentIndex = stepSequence.indexOf(currentStep);

  if (currentIndex < stepSequence.length - 1) {
    return stepSequence[currentIndex + 1];
  }

  return null; // No next step (completed all steps)
};

// Get previous step for back button navigation
export const getPreviousStep = (
  currentStep: QualificationStep,
  previousStep?: QualificationStep | null
): QualificationStep | null => {
  if (currentStep === "disqualified" && previousStep) {
    return previousStep;
  }

  const stepSequence: QualificationStep[] = [
    "step-one",
    "step-two",
    "step-three",
    "step-four",
    "step-five",
    "review",
  ];

  const currentIndex = stepSequence.indexOf(currentStep);

  if (currentIndex > 0) {
    return stepSequence[currentIndex - 1];
  }

  return null;
};

export const stepLabels = [
  "Basic Info",
  "Need - Priority Qualification",
  "Timing - Determining Factor",
  "Authority",
  "Budget",
  "Bant score",
];

export const getCurrentStepNumber = (
  currentStep: QualificationStep
): number => {
  switch (currentStep) {
    case "step-one":
      return 1;
    case "step-two":
      return 2;
    case "step-three":
      return 3;
    case "step-four":
      return 4;
    case "step-five":
      return 5;
    case "review":
      return 6;
    default:
      return 1;
  }
};
