import {
  StepQualificationOneFormValues,
  StepQualificationThreeFormValues,
  StepQualificationTwoFormValues,
  StepQualificationFourFormValues,
  StepQualificationFiveFormValues,
  ReviewQualificationFormValues,
  disqualifiedLeadFormValues,
  StepSevenQualificationFormValues,
} from "@/schemas/leadQualificationSchema";
import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";

const customStorage: StateStorage = {
  getItem: (name) => {
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

// Step types
export type QualificationStep =
  | "step-one"
  | "step-two"
  | "step-three"
  | "step-four"
  | "step-five"
  | "review"
  | "step-seven"
  | "meeting"
  | "disqualified";

// Step titles
export const stepTitles: Record<QualificationStep, string> = {
  "step-one": "Contact Information",
  "step-two": "Priority",
  "step-three": "Timing",
  "step-four": "Authority",
  "step-five": "Budget",
  review: "Review & Submit",
  "step-seven": "Shipping",
  meeting: "Schedule a meeting",
  disqualified: "Disqualification Reason",
};

// Qualification store
export type QualificationData = StepQualificationOneFormValues &
  StepQualificationTwoFormValues &
  StepQualificationThreeFormValues &
  StepQualificationFourFormValues &
  StepQualificationFiveFormValues &
  ReviewQualificationFormValues &
  disqualifiedLeadFormValues &
  StepSevenQualificationFormValues & {
    contactId?: string;
    ownerId?: string;
  };

export interface QualificationStore {
  data: QualificationData;
  currentStep: QualificationStep;
  completedSteps: QualificationStep[];
  previousStep: QualificationStep | null;
  hasChanges: boolean;
  resetVersion: number; // Add reset version counter
  updateData: (newData: Partial<QualificationData>) => void;
  setStep: (step: QualificationStep) => void;
  setPreviousStep: (step: QualificationStep | null) => void;
  completeStep: (step: QualificationStep) => void;
  resetData: () => void;
  setHasChanges: (value: boolean) => void;
}

const initialData: QualificationData = {
  contactId: undefined,
  name: "",
  lastname: "",
  email: "",
  phone: "",
  zipCode: "",
  country: "USA",
  state: "Alabama",
  city: "",
  leadType: "",
  hearAboutUs: "",
  currentSituation: [],
  lookingFor: "",
  lead_owner_id: "",
  building_type: "",
  project_type: "",
  current_system_type: null,
  system_age: null,
  main_project_goals: [],
  competitors_previously_contacted: "",
  competitors_name: "",
  desired_timeframe: "",
  decisive_timing_factor: [],
  other_timing_factor: "",
  decision_making_status: "",
  property_type: "",
  type_of_decision: "",
  additional_comments: "",
  defined_a_budget: "",
  budget_range: "",
  aware_of_available_financial_incentives: "",
  planned_financial_method: "",
  bant_score: "",
  hs_lead_status: "",
  disqualification_reason: "",
  disqualification_explanation: "",
  shipping_address: "",
  shipping_city: "",
  shipping_state: "",
  shipping_province: "",
  shipping_zip_code: "",
  shipping_country: "",
  shipping_notes: "",
  ownerId: undefined,
};

const initialState = {
  data: initialData,
  currentStep: "step-one" as QualificationStep,
  completedSteps: [] as QualificationStep[],
  previousStep: null as QualificationStep | null,
  hasChanges: false,
  resetVersion: 0,
};

export const useQualificationStore = create(
  persist<QualificationStore>(
    (set, get) => ({
      ...initialState,
      updateData: (newData) =>
        set((state) => {
          // Check if there are actual changes by comparing each property
          let changesDetected = false;

          // More robust check for all data types
          for (const key in newData) {
            const typedKey = key as keyof QualificationData;
            const oldValue = state.data[typedKey];
            const newValue = newData[typedKey];

            // For arrays, check length and content
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
              if (oldValue.length !== newValue.length) {
                changesDetected = true;
                break;
              }

              // Check if array contents differ
              for (let i = 0; i < oldValue.length; i++) {
                if (
                  JSON.stringify(oldValue[i]) !== JSON.stringify(newValue[i])
                ) {
                  changesDetected = true;
                  break;
                }
              }
            }
            // For other values, use simple comparison
            else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
              changesDetected = true;
              break;
            }
          }

          // console.log(
          //   "Changes detected:",
          //   changesDetected,
          //   "for keys:",
          //   Object.keys(newData)
          // );

          return {
            data: {
              ...state.data,
              ...newData,
            } as QualificationData,
            hasChanges: changesDetected || state.hasChanges,
          };
        }),
      setStep: (step) => set(() => ({ currentStep: step })),
      setPreviousStep: (step) => set(() => ({ previousStep: step })),
      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),
      resetData: () => {
        // Clear the persisted data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("qualification-storage");
          console.log("Cleared localStorage qualification data");
        }

        // Increment reset version first to ensure React components using it will update
        const newResetVersion = get().resetVersion + 1;
        console.log("New reset version:", newResetVersion);

        // Do a complete state reset
        set({
          data: { ...initialData }, // Create a new object reference
          currentStep: "step-one",
          completedSteps: [],
          previousStep: null,
          hasChanges: false,
          resetVersion: newResetVersion,
        });
      },
      setHasChanges: (value) => set(() => ({ hasChanges: value })),
    }),
    {
      name: "qualification-storage",
      storage: createJSONStorage(() => customStorage),
      version: 1,
    }
  )
);
