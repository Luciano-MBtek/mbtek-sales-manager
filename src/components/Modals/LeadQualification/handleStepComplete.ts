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
import { triggerLeadQualificationWebhook } from "@/actions/webhooks/leadQualificationWebhook";
import { createCompleteDeal } from "@/actions/contact/createCompleteDeal";
import { GetContactOwner } from "@/actions/getContactOwner";

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
  const { updateData, setIsSaving, toast, setHasChanges, resetData, onClose } =
    deps;

  setIsSaving(true);

  console.log(
    "⭐ CURRENT STEP TYPE:",
    typeof currentStep,
    "VALUE:",
    currentStep
  );
  console.log("⭐ IS DISQUALIFIED STEP?", currentStep === "disqualified");

  try {
    // Para asegurarnos que no hay problema de comparación de strings:
    if (String(currentStep) === "disqualified") {
      console.log("🚨 DISQUALIFICATION PATH ACTIVATED");

      // Actualizar datos primero
      updateData(stepData);

      // Procesar descalificación
      if (!deps.data.contactId) {
        throw new Error("Contact ID not found");
      }

      try {
        // Actualizar contacto directamente
        await patchContactProperties(
          deps.data.contactId,
          createDisqualifyProperties(stepData as disqualifiedLeadFormValues)
        );

        // Mostrar mensaje de éxito
        toast({
          title: "Success",
          description: "Lead has been disqualified",
        });

        console.log("🚨 ABOUT TO RESET STORE");

        // Reset directo del store - borrar todos los datos
        if (typeof resetData === "function") {
          console.log("🚨 RESET FUNCTION EXISTS");
          try {
            resetData();
            console.log("🚨 STORE RESET COMPLETED");
          } catch (resetError) {
            console.error("ERROR DURING RESET:", resetError);
          }
        } else {
          console.log("🚨 NO RESET FUNCTION AVAILABLE", typeof resetData);
        }

        // Cerrar modal inmediatamente
        console.log("🚨 CLOSING MODAL");
        onClose();
        return;
      } catch (error) {
        console.error("Error disqualifying lead:", error);
        throw error;
      }
    }

    // For normal (non-disqualified) steps
    const forceProcess = currentStep === "step-one";
    updateData(stepData);

    const currentHasChanges = useQualificationStore.getState().hasChanges;
    console.log("Current has changes from store:", currentHasChanges);

    const shouldProcessStep = currentHasChanges || forceProcess;
    console.log(
      "Should process step:",
      shouldProcessStep,
      "for step:",
      currentStep
    );

    // Complete "review" step specially
    if (currentStep === "review" && shouldProcessStep) {
      console.log("REVIEW COMPLETION PATH ACTIVATED");

      // Process step data
      await processStepData(currentStep, stepData, deps);

      // Show success message
      toast({
        title: "Success",
        description: "Qualification process completed successfully",
      });
    }

    // Regular steps processing
    if (shouldProcessStep) {
      await processStepData(currentStep, stepData, deps);
    }

    // Mark step as complete and continue
    deps.completeStep(currentStep);

    if (setHasChanges) {
      setHasChanges(false);
    }

    // Move to next step if available
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      deps.setStep(nextStep);
      if (shouldProcessStep) {
        toast({
          title: "Step Completed",
          description: `Successfully saved ${stepTitles[currentStep]}`,
        });
      } else {
        toast({
          title: "Moving Forward",
          description: `Proceeding to next step: ${stepTitles[nextStep]}`,
        });
      }
    } else {
      if (currentStep === "step-seven") {
        if (resetData) {
          // resetData();
          console.log("Store reset completed");
        }
        onClose();
      }
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

        const singleProduct = stepData.lookingFor;

        await triggerLeadQualificationWebhook(contactId, singleProduct);

        if (typeof resetData === "function") {
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

      const contactOwnerId = await GetContactOwner(data.contactId);

      // await createCompleteDeal(
      //   data.contactId,
      //   data.name,
      //   data.lastname,
      //   contactOwnerId
      // );

      // await triggerLeadQualificationWebhook(data.contactId, data.lookingFor);

      // send the data via webhook to lead qualified complete system
      break;
    case "disqualified":
      if (!data.contactId) throw new Error("Contact ID not found");
      await patchContactProperties(
        data.contactId,
        createDisqualifyProperties(stepData as disqualifiedLeadFormValues)
      );
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
    "step-seven",
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
    "step-seven",
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
  "Shipping",
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
    case "step-seven":
      return 7;
    default:
      return 1;
  }
};
