export interface StepInfo {
  step: number;
  name: string;
  description: string;
  completed: boolean;
}

// Define required property groups for each step with consideration for conditional properties
const stepRequirements = {
  step1: {
    required: [
      "firstname",
      "lastname",
      "email",
      "phone",
      "looking_for",
      "lead_owner_id",
    ],
    // Properties that are conditionally required based on country
    conditionalGroups: [
      ["country", "state"], // Either USA with state
      ["country", "province"], // Or Canada with province
    ],
  },
  step2: {
    required: [
      "building_type",
      "project_type",
      "main_project_goals",
      "competitors_previously_contacted",
    ],
    conditionalGroups: [
      // current_system_type and system_age are only required if not a new installation
      ["project_type:new_installation"], // If this is true, no further checks needed
      ["current_system_type", "system_age"], // Otherwise, these are required
    ],
  },
  step3: {
    required: ["desired_timeframe", "decisive_timing_factor"],
    conditionalGroups: [
      // If decisive_timing_factor includes "other", other_timing_factor is required
      ["decisive_timing_factor:!other"], // If doesn't contain "other", no further checks
      ["other_timing_factor"], // Otherwise, other_timing_factor is required
    ],
  },
  step4: {
    required: ["decision_making_status", "property_type", "type_of_decision"],
    // additional_comments is optional
    conditionalGroups: [],
  },
  step5: {
    required: [
      "defined_a_budget",
      "budget_range",
      "aware_of_available_financial_incentives",
      "planned_financial_method",
    ],
    conditionalGroups: [],
  },
  stepFinal: {
    required: ["bant_score"],
    conditionalGroups: [],
  },
  stepMeeting: {
    required: ["meeting_scheduled"],
    conditionalGroups: [],
  },
};

export const qualificationSteps: StepInfo[] = [
  {
    step: 1,
    name: "Contact Information",
    description: "Basic information and needs",
    completed: false,
  },
  {
    step: 2,
    name: "Project Details",
    description: "Building and project specifications",
    completed: false,
  },
  {
    step: 3,
    name: "Timing",
    description: "Timeline and decisive factors",
    completed: false,
  },
  {
    step: 4,
    name: "Decision Making",
    description: "Decision structure and authority",
    completed: false,
  },
  {
    step: 5,
    name: "Budget",
    description: "Financial planning and resources",
    completed: false,
  },
  {
    step: 6,
    name: "BANT Score",
    description: "Final qualification score",
    completed: false,
  },
  {
    step: 7,
    name: "Meeting",
    description: "Book a meeting with Sales",
    completed: false,
  },
];

/**
 * Checks if a property passes the conditional check
 * Format can be:
 * - simple property name: checks if property exists
 * - property:value: checks if property equals value
 * - property:!value: checks if property doesn't equal or include value
 */
function checkConditionalProperty(
  properties: Record<string, any>,
  condition: string
): boolean {
  if (condition.includes(":")) {
    const [propName, value] = condition.split(":");

    // Check for negation
    if (value.startsWith("!")) {
      const targetValue = value.substring(1);

      // Check for array inclusion
      if (Array.isArray(properties[propName])) {
        return !properties[propName].includes(targetValue);
      }

      // Check for equality
      return properties[propName] !== targetValue;
    }

    // Positive check (equals value)
    return properties[propName] === value;
  }

  // Simple existence check
  return (
    properties[condition] !== undefined &&
    properties[condition] !== null &&
    properties[condition] !== ""
  );
}

/**
 * Checks if a conditional group is satisfied
 * Each conditional group is an OR condition - if any conditional group is satisfied,
 * the conditional requirement is met
 */
function checkConditionalGroups(
  properties: Record<string, any>,
  conditionalGroups: string[][]
): boolean {
  // If no conditional groups, assume condition is met
  if (!conditionalGroups || conditionalGroups.length === 0) {
    return true;
  }

  // For each conditional group (OR relationship between groups)
  return conditionalGroups.some((group) => {
    // Within each group, all conditions must be met (AND relationship)
    return group.every((condition) =>
      checkConditionalProperty(properties, condition)
    );
  });
}

/**
 * Determines if a step is completed based on its required properties
 * and conditional logic
 */
function isStepCompleted(
  properties: Record<string, any>,
  stepKey: keyof typeof stepRequirements
): boolean {
  const step = stepRequirements[stepKey];

  // Check required properties
  const requiredPropsComplete = step.required.every(
    (prop) =>
      properties[prop] !== undefined &&
      properties[prop] !== null &&
      properties[prop] !== ""
  );

  // If required properties aren't complete, step isn't complete
  if (!requiredPropsComplete) return false;

  // Check conditional groups
  return checkConditionalGroups(properties, step.conditionalGroups);
}

/**
 * Determines which qualification steps have been completed based on the properties
 * This version handles conditional properties better
 */
export function getCompletedQualificationSteps(
  properties: Record<string, any>
): StepInfo[] {
  const steps = [...qualificationSteps];

  // Check each step individually without requiring sequential completion
  steps[0].completed = isStepCompleted(properties, "step1");
  steps[1].completed = isStepCompleted(properties, "step2");
  steps[2].completed = isStepCompleted(properties, "step3");
  steps[3].completed = isStepCompleted(properties, "step4");
  steps[4].completed = isStepCompleted(properties, "step5");

  // The BANT score step is special - if it exists, it means all previous steps
  // have been effectively "completed" even if some properties are null
  steps[5].completed =
    properties.bant_score !== undefined &&
    properties.bant_score !== null &&
    properties.bant_score !== "";

  // The Meeting step is completed if meeting_scheduled property exists
  steps[6].completed =
    properties.meeting_scheduled !== undefined &&
    properties.meeting_scheduled !== null &&
    properties.meeting_scheduled !== "";

  // If BANT score exists, mark all previous steps as effectively completed
  if (steps[5].completed) {
    for (let i = 0; i < 5; i++) {
      steps[i].completed = true;
    }
  }

  return steps;
}

/**
 * Gets the highest completed step number (1-6)
 * @param properties The HubSpot contact properties
 * @returns Number representing the highest completed step
 */
export function getCurrentQualificationStep(
  properties: Record<string, any>
): number {
  if (properties.meeting_scheduled) {
    return 7;
  }
  // If BANT score exists, we're at step 6 regardless of other properties
  if (properties.bant_score) {
    return 6;
  }

  const steps = getCompletedQualificationSteps(properties);

  // Find the highest completed step
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].completed) {
      return i + 1;
    }
  }

  // If no steps completed but has basic info, return step 1
  if (properties.firstname && properties.lastname) {
    return 1;
  }

  return 0;
}

/**
 * Calculate the progress percentage (0-100)
 * @param properties The HubSpot contact properties
 * @returns Progress percentage
 */
export function getQualificationProgress(
  properties: Record<string, any>
): number {
  // If BANT score exists, progress is 100%
  if (properties.meeting_scheduled) {
    return 100;
  }

  // If BANT score exists but no meeting yet, progress is around 85%
  if (properties.bant_score) {
    return 85;
  }

  const steps = getCompletedQualificationSteps(properties);
  const completedSteps = steps.filter((step) => step.completed).length;
  return Math.round((completedSteps / steps.length) * 100);
}
