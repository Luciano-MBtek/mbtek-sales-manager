"use client";
import { ProgressProperties } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Calendar,
  BarChart2,
  DollarSign,
  User,
  UserCheck,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  lookingFor,
  leadType,
  hearAboutUs,
  currentSituation,
  buildingType,
  projectType,
  currentSystemType,
  systemAge,
  mainProjectGoals,
  desiredTimeframe,
  decisiveTimingFactor,
  decisionMakingStatus,
  propertyType,
  typeOfDecision,
  budgetRange,
  plannedFinancialMethod,
  leadStatus,
} from "@/types";

const ContactQualificationCard = ({
  properties,
}: {
  properties: ProgressProperties;
}) => {
  // Helper function to get label from value using the lookup arrays
  const getLabelFromValue = (
    value: string | undefined,
    lookupArray: { label: string; value: string }[]
  ): string => {
    if (!value) return "-";
    const found = lookupArray.find((item) => item.value === value);
    return found ? found.label : value;
  };

  // Format title based on looking_for property
  const formatTitle = (lookingForValue: string | undefined) => {
    if (!lookingForValue) return "Lead Information";
    return getLabelFromValue(lookingForValue, lookingFor);
  };

  // Helper for Yes/No values
  const formatYesNo = (value: string | undefined) => {
    return value || "-";
  };

  // Group 1: Basic Info (Step 1)
  const basicInfo = [
    {
      label: "Lead Type",
      // For lead type, we don't have a label/value structure, just an array of strings
      value: properties.lead_type ? properties.lead_type : "-",
    },
    {
      label: "Heard About Us",
      value: getLabelFromValue(properties.hear_about_us, hearAboutUs),
    },
    {
      label: "Current Situation",
      value: getLabelFromValue(properties.current_situation, currentSituation),
    },
  ];

  // Group 2: Building Info (Step 2)
  const buildingInfo = [
    {
      label: "Building Type",
      value: getLabelFromValue(properties.building_type, buildingType),
    },
    {
      label: "Project Type",
      value: getLabelFromValue(properties.project_type, projectType),
    },
    {
      label: "Current System Type",
      value: getLabelFromValue(
        properties.current_system_type,
        currentSystemType
      ),
    },
    {
      label: "System Age",
      value: getLabelFromValue(properties.system_age, systemAge),
    },
    {
      label: "Main Project Goals",
      // For array values, we need to process each one
      value: properties.main_project_goals
        ? properties.main_project_goals
            .split(";")
            .map((goal) => getLabelFromValue(goal.trim(), mainProjectGoals))
            .join(", ")
        : "-",
    },
    {
      label: "Contacted Competitors",
      value: formatYesNo(properties.competitors_previously_contacted),
    },
    {
      label: "Competitor Names",
      value: properties.competitors_name || "-",
    },
  ];

  // Group 3: Timeline Info (Step 3)
  const timelineInfo = [
    {
      label: "Desired Timeframe",
      value: getLabelFromValue(properties.desired_timeframe, desiredTimeframe),
    },
    {
      label: "Timing Factors",
      // Handle arrays similarly to project goals
      value: properties.decisive_timing_factor
        ? properties.decisive_timing_factor
            .split(";")
            .map((factor) =>
              getLabelFromValue(factor.trim(), decisiveTimingFactor)
            )
            .join(", ")
        : "-",
    },
    {
      label: "Other Timing Factor",
      value: properties.other_timing_factor || "-",
    },
  ];

  // Group 4: Decision Making (Step 4)
  const decisionInfo = [
    {
      label: "Decision Making Status",
      value: getLabelFromValue(
        properties.decision_making_status,
        decisionMakingStatus
      ),
    },
    {
      label: "Property Type",
      value: getLabelFromValue(properties.property_type, propertyType),
    },
    {
      label: "Type of Decision",
      value: getLabelFromValue(properties.type_of_decision, typeOfDecision),
    },
    {
      label: "Additional Comments",
      value: properties.additional_comments || "-",
    },
  ];

  // Group 5: Budget Info (Step 5)
  const budgetInfo = [
    {
      label: "Has Defined Budget",
      value: formatYesNo(properties.defined_a_budget),
    },
    {
      label: "Budget Range",
      value: getLabelFromValue(properties.budget_range, budgetRange),
    },
    {
      label: "Aware of Financial Incentives",
      value: formatYesNo(properties.aware_of_available_financial_incentives),
    },
    {
      label: "Planned Financial Method",
      value: getLabelFromValue(
        properties.planned_financial_method,
        plannedFinancialMethod
      ),
    },
  ];

  // Function to determine if a section has any data
  const hasData = (items: { label: string; value: any }[]) => {
    return items.some(
      (item) =>
        item.value !== null && item.value !== undefined && item.value !== "-"
    );
  };

  // Calculate BANT score if available
  const bantScore = properties.bant_score
    ? JSON.parse(properties.bant_score)
    : null;

  // Get lead status label
  const getLeadStatusLabel = (statusValue: string | undefined) => {
    if (!statusValue) return "";
    const found = leadStatus.find((item) => item.value === statusValue);
    return found ? found.label : statusValue.replace(/_/g, " ");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          {formatTitle(properties.looking_for)}
        </CardTitle>

        {properties.hs_lead_status && (
          <div>
            <Badge
              className={
                properties.hs_lead_status === "OPEN_DEAL"
                  ? "bg-success"
                  : "bg-primary"
              }
            >
              {getLeadStatusLabel(properties.hs_lead_status)}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* BANT Score if available */}
        {bantScore && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              <h3 className="font-medium">BANT Score: {bantScore.total}%</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Need</p>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${(bantScore.need / bantScore.needMax) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-right">
                  {bantScore.need}/{bantScore.needMax}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Authority</p>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{
                      width: `${(bantScore.authority / bantScore.authorityMax) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-right">
                  {bantScore.authority}/{bantScore.authorityMax}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Timing</p>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${(bantScore.timing / bantScore.timingMax) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-right">
                  {bantScore.timing}/{bantScore.timingMax}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Budget</p>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${(bantScore.budget / bantScore.budgetMax) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-right">
                  {bantScore.budget}/{bantScore.budgetMax}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info */}
        {hasData(basicInfo) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Lead Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {basicInfo.map(
                (item, index) =>
                  item.value &&
                  item.value !== "-" && (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Building Info */}
        {hasData(buildingInfo) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Building & System Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {buildingInfo.map(
                (item, index) =>
                  item.value &&
                  item.value !== "-" && (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Timeline Info */}
        {hasData(timelineInfo) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Project Timeline</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {timelineInfo.map(
                (item, index) =>
                  item.value &&
                  item.value !== "-" && (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Decision Info */}
        {hasData(decisionInfo) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Decision Making</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {decisionInfo.map(
                (item, index) =>
                  item.value &&
                  item.value !== "-" && (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Budget Info */}
        {hasData(budgetInfo) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Budget Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {budgetInfo.map(
                (item, index) =>
                  item.value &&
                  item.value !== "-" && (
                    <div key={index} className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactQualificationCard;
