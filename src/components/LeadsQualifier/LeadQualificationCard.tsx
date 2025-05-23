import {
  AlertCircle,
  BarChart4,
  BoxIcon,
  Calendar,
  FilesIcon,
  LayersIcon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  getCurrentQualificationStep,
  getQualificationProgress,
  qualificationSteps,
} from "./leadQualificationProgress";
import { formatDateWithDay } from "@/lib/utils";
import { LeadQualificationProgress } from "../Modals/LeadQualification/lead-qualification-progress-bar";

import QualificationButton from "../Modals/LeadQualification/QualificationButton";
import DisqualifyButton from "./DisqualifyButton";
import { LeadProps } from "@/types";

export function LeadCard({
  lead,
  onClick,
}: {
  lead: LeadProps;
  onClick: () => void;
}) {
  const bantScore = lead.properties.bant_score
    ? JSON.parse(lead.properties.bant_score)
    : null;

  const totalScore = bantScore?.total || 0;
  const scoreColor = totalScore >= 75 ? "text-green-600" : "text-amber-600";

  const currentStep = getCurrentQualificationStep(lead.properties);
  const progressPercentage = getQualificationProgress(lead.properties);

  return (
    <Card className="border-slate-200 hover:border-slate-300 transition-all ">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            {lead.properties.firstname} {lead.properties.lastname}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            {formatDateWithDay(lead.properties.createdate)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-10 pb-10">
        <div className="flex justify-between items-center">
          <div
            onClick={onClick}
            className="cursor-pointer rounded p-4 hover:bg-slate-100 transition-colors"
          >
            {lead.properties.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700 truncate">
                  {lead.properties.email}
                </span>
              </div>
            )}

            {lead.properties.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{lead.properties.phone}</span>
              </div>
            )}

            {bantScore ? (
              <div className="flex items-center gap-2 text-sm">
                <BarChart4 className="h-4 w-4 text-slate-500" />
                <span className={`font-medium ${scoreColor}`}>
                  BANT Score: {bantScore.total}%
                </span>
              </div>
            ) : lead.properties.looking_for === "complete_system" ? (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-500">
                  Qualification in progress
                </span>
              </div>
            ) : null}
          </div>

          {/* Upcoming Meetings Section */}
          {lead.properties.meetings?.upcoming && (
            <div className="space-y-2 ">
              <div className="flex justify-between items-center text-sm mb-2">
                <p className="text-slate-700 font-medium">Upcoming Meeting</p>
              </div>
              <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-slate-700 font-medium">
                    {lead.properties.meetings.upcoming.title}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {new Date(
                    lead.properties.meetings.upcoming.start ?? new Date()
                  ).toLocaleString()}{" "}
                  -{" "}
                  {new Date(
                    lead.properties.meetings.upcoming.end ?? new Date()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {lead.properties.meetings.upcoming.link && (
                  <a
                    href={lead.properties.meetings.upcoming.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-blue-600 hover:underline inline-block"
                  >
                    Join meeting
                  </a>
                )}
              </div>
            </div>
          )}
          {/* Open progress section */}
          <div className="flex flex-col gap-2">
            {lead.properties.looking_for && (
              <div className="flex items-center justify-end gap-2 text-sm">
                {lead.properties.looking_for === "complete_system" ? (
                  <LayersIcon className="h-4 w-4 text-slate-500" />
                ) : lead.properties.looking_for === "single_products_quote" ? (
                  <BoxIcon className="h-4 w-4 text-slate-500" />
                ) : (
                  <FilesIcon className="h-4 w-4 text-slate-500" />
                )}
                <p className="font-bold">
                  {lead.properties.looking_for === "complete_system"
                    ? "Complete System"
                    : lead.properties.looking_for === "single_products_quote"
                      ? "Single Product"
                      : lead.properties.looking_for}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              {lead.properties.looking_for === "complete_system" && (
                <>
                  <DisqualifyButton lead={lead} />

                  <QualificationButton lead={lead} buttonLabel="Continue" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Qualification Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm mb-6">
            <p className="text-slate-700 font-medium">Qualification Progress</p>
            <span className="text-slate-500">
              Step {currentStep} of {qualificationSteps.length}
            </span>
          </div>
          {lead.properties.looking_for === "complete_system" && (
            <LeadQualificationProgress
              currentStep={currentStep}
              steps={qualificationSteps}
              progressPercentage={progressPercentage}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
