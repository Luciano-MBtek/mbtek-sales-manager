"use server";

import { revalidatePath } from "next/cache";

type QualificationStep =
  | "step-one"
  | "step-two"
  | "step-three-b2c"
  | "step-three-b2b"
  | "step-four"
  | "step-five"
  | "review";

export async function saveQualificationStep(
  step: QualificationStep,
  data: Record<string, any>
) {
  try {
    // Depending on the step, you might want to perform different actions:

    // For step one - create or update a contact
    if (step === "step-one") {
      // Example: call your API or database directly
      // const response = await createOrUpdateContact(data);
      console.log("Saving contact data:", data);
      // return response;
    }

    // For other steps - update different aspects of the lead record
    // You can add specific handlers for each step

    // Example of simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Revalidate relevant paths to refresh any server-rendered components
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(`Error saving ${step}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
