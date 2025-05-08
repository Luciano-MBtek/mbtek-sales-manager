"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useQualificationStore,
  QualificationData,
} from "@/store/qualification-store";
import { Form } from "@/components/ui/form";
import {
  reviewQualificationSchema,
  ReviewQualificationFormValues,
} from "@/schemas/leadQualificationSchema";

interface ReviewContentProps {
  onComplete: (data: Partial<QualificationData>) => void;
  initialData: QualificationData;
  formRef: React.RefObject<HTMLFormElement | null>;
  onBantScoreChange?: (score: { total: number }) => void;
}

export default function ReviewContent({
  onComplete,
  initialData,
  formRef,
  onBantScoreChange,
}: ReviewContentProps) {
  const [bantScore, setBantScore] = useState({
    need: 0,
    needMax: 30,
    authority: 0,
    authorityMax: 25,
    timing: 0,
    timingMax: 25,
    budget: 0,
    budgetMax: 20,
    total: 0,
  });

  const form = useForm<ReviewQualificationFormValues>({
    resolver: zodResolver(reviewQualificationSchema),
    defaultValues: {
      bant_score: JSON.stringify(bantScore),
    },
  });

  const { data } = useQualificationStore();

  useEffect(() => {
    if (onBantScoreChange) {
      onBantScoreChange(bantScore);
    }
  }, [bantScore, onBantScoreChange]);

  useEffect(() => {
    calculateBantScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    // Update form value when bantScore changes
    form.setValue("bant_score", JSON.stringify(bantScore));
  }, [bantScore, form]);

  const calculateBantScore = () => {
    // Initialize scores
    const scores = {
      need: 0,
      authority: 0,
      timing: 0,
      budget: 0,
    };

    // Need score calculation (max 30%)
    // Current Situation (10%)
    const situationScores: Record<string, number> = {
      system_failure: 10,
      looking_replacement: 8,
      renovation_project: 5,
      seeking_information: 2,
    };

    if (data.currentSituation) {
      for (const situation in situationScores) {
        if (data.currentSituation.includes(situation)) {
          scores.need += situationScores[situation];
          break;
        }
      }
    }

    // Looking for (5%)
    if (data.lookingFor === "complete_system") {
      scores.need += 5;
    }

    // Project Type (5%)
    const projectTypeScores: Record<string, number> = {
      system_replacement: 5,
      new_installation: 4,
      system_upgrade_extension: 3,
      maintenance_repair_only: 1,
    };
    scores.need += projectTypeScores[data.project_type] || 0;

    // System Age (5%)
    const systemAgeScores: Record<string, number> = {
      "20_plus": 5,
      "10_to_20": 4,
      "5_to_10": 2,
      "0_to_5": 1,
    };
    scores.need += data.system_age ? systemAgeScores[data.system_age] || 0 : 0;

    // Main Project Goals (max 10%)
    if (data.main_project_goals) {
      const goalScores: Record<string, number> = {
        replace_failing_equipment: 10,
        reduce_energy_costs: 8,
        add_cooling_capabilities: 7,
        improve_comfort: 6,
        environmental_concerns: 5,
      };

      let goalsScore = 0;
      for (const goal in goalScores) {
        if (data.main_project_goals.includes(goal)) {
          goalsScore = Math.max(goalsScore, goalScores[goal]);
        }
      }
      scores.need += goalsScore;
    }

    // Cap Need score at 30%
    scores.need = Math.min(scores.need, 30);

    // Timing score calculation (max 25%)
    // Desired Timeframe (15%)
    const timeframeScores: Record<string, number> = {
      urgent: 15,
      short: 12,
      medium: 8,
      long: 4,
    };
    scores.timing += timeframeScores[data.desired_timeframe] || 0;

    // Decisive Timing Factor (10%)
    if (data.decisive_timing_factor) {
      const factorScores: Record<string, number> = {
        current_system_failure: 10,
        seasonality: 8,
        stock_availability: 7,
        planned_global_renovation: 6,
        availability_of_financial_incentives: 5,
        other: 3,
      };

      let factorScore = 0;
      for (const factor in factorScores) {
        if (data.decisive_timing_factor.includes(factor)) {
          factorScore = Math.max(factorScore, factorScores[factor]);
        }
      }
      scores.timing += factorScore;
    }

    // Cap Timing score at 25%
    scores.timing = Math.min(scores.timing, 25);

    // Authority score calculation (max 25%)
    // Decision-making status (15%)
    const decisionScores: Record<string, number> = {
      sole_decision_maker: 15,
      co_decision_maker: 12,
      recommender_prescriber: 8,
      information_only: 3,
    };
    scores.authority += decisionScores[data.decision_making_status] || 0;

    // Property type (10%)
    const propertyScores: Record<string, number> = {
      owner: 10,
      corporate_facility_manager: 8,
      property_management_company: 7,
      real_state_developer: 5,
      tenant: 3,
    };
    scores.authority += propertyScores[data.property_type] || 0;

    // Cap Authority score at 25%
    scores.authority = Math.min(scores.authority, 25);

    // Budget score calculation (max 20%)
    // Budget defined (5%)
    if (data.defined_a_budget === "Yes") {
      scores.budget += 5;
    }

    // Budget range (10%)
    const budgetRangeScores: Record<string, number> = {
      "10000_to_20000": 10,
      more_than_20000: 8,
      "5000_to_10000": 5,
      less_than_5000: 2,
    };
    scores.budget += budgetRangeScores[data.budget_range] || 0;

    // Financing method (5%)
    const financingScores: Record<string, number> = {
      personal_funds: 5,
      bank_loan: 4,
      property_improvement_loan: 4,
      leasing_financing: 3,
      pending_information: 1,
    };
    scores.budget += financingScores[data.planned_financial_method] || 0;

    // Cap Budget score at 20%
    scores.budget = Math.min(scores.budget, 20);

    // Total BANT score
    const totalScore =
      scores.need + scores.authority + scores.timing + scores.budget;

    setBantScore({
      need: scores.need,
      needMax: 30,
      authority: scores.authority,
      authorityMax: 25,
      timing: scores.timing,
      timingMax: 25,
      budget: scores.budget,
      budgetMax: 20,
      total: totalScore,
    });
  };

  const getLeadStatusColor = (score: number) => {
    if (score >= 75) return "text-green-600 bg-green-100 border-green-500";
    if (score >= 50) return "text-blue-600 bg-blue-100 border-blue-500";
    if (score >= 25) return "text-yellow-600 bg-yellow-100 border-yellow-500";
    return "text-red-600 bg-red-100 border-red-500";
  };

  const getLeadStatusText = (score: number) => {
    if (score >= 75) return "Hot Lead";
    if (score >= 50) return "Warm Lead";
    if (score >= 25) return "Cool Lead (disqualified)";
    return "Cold Lead (disqualified)";
  };

  const handleSubmit = (formData: ReviewQualificationFormValues) => {
    onComplete({
      bant_score: formData.bant_score,
    });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <input type="hidden" {...form.register("bant_score")} />

        <div className="flex flex-col w-full items-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {/* BANT Score Breakdown Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  BANT Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Need:</span>
                    <span className="font-bold">
                      {bantScore.need}/{bantScore.needMax}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Authority:</span>
                    <span className="font-bold">
                      {bantScore.authority}/{bantScore.authorityMax}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Timing:</span>
                    <span className="font-bold">
                      {bantScore.timing}/{bantScore.timingMax}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Budget:</span>
                    <span className="font-bold">
                      {bantScore.budget}/{bantScore.budgetMax}
                    </span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">
                        {bantScore.total}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Status Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div
                  className={`border-2 rounded-lg p-6 w-full text-center ${getLeadStatusColor(
                    bantScore.total
                  )}`}
                >
                  <h1 className="text-2xl font-bold">
                    {getLeadStatusText(bantScore.total)}
                  </h1>
                  <p className="text-sm mt-2">
                    {bantScore.total}% Qualification
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
