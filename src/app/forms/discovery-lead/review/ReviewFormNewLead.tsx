"use client";

import SubmitButton from "@/components/SubmitButton";
import InfoItem from "@/components/InfoItem";
import { submitLeadAction } from "./actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAddLeadContext } from "@/contexts/addDealContext";
import { newLeadType } from "@/schemas/newLeadSchema";
import {
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ReviewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { newLeadData, resetLocalStorage } = useAddLeadContext();
  const [showDialog, setShowDialog] = useState(false);
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);

  const {
    name,
    lastname,
    email,
    phone,
    country,
    state,
    province,
    leadType,
    projectSummary,
    reasonForCalling,
    wantCompleteSystem,
    allocatedBudget,
    stepsForDecision,
    leadBuyingIntention,
    expectedETA,
    decisionMaker,
    goodFitForLead,
    moneyAvailability,
    estimatedTimeForBuying,
  } = newLeadData;

  const disqualifyingAnswers = [
    decisionMaker,
    goodFitForLead,
    moneyAvailability,
    estimatedTimeForBuying,
  ];

  const isLeadDisqualified = disqualifyingAnswers.some(
    (answer) => answer === "No"
  );
  const isLeadQualified = disqualifyingAnswers.every(
    (answer) => answer === "Yes"
  );

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitLeadAction(newLeadData as newLeadType);
    const { redirect1, redirect2, errorMsg, success } = res;

    if (success) {
      toast({
        title: "Success",
        description: "Deal submitted successfully",
      });

      setRedirectOptions({
        redirect1: redirect1,
        redirect2: redirect2,
      });
      resetLocalStorage();
      setShowDialog(true);
    } else if (!success) {
      toast({
        title: "Error",
        description: `${errorMsg}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form
        action={handleFormSubmit}
        className="flex flex-1 flex-col gap-2 items-stretch lg:max-w-full"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Lead Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {isLeadDisqualified ? (
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-4 w-full max-w-[700px]">
                <h1 className="text-red-600 text-2xl font-bold text-center">
                  Disqualified Lead
                </h1>
              </div>
            ) : isLeadQualified ? (
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-4 w-full max-w-[700px]">
                <h1 className="text-green-600 text-2xl font-bold text-center">
                  Qualified Lead
                </h1>
              </div>
            ) : (
              <div className="border-2 rounded-lg p-6 mb-4 w-full max-w-[700px]">
                <h1 className="text-2xl text-primary font-bold text-center">
                  Unqualified Lead
                </h1>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Name"
                value={`${name} ${lastname}`}
              />
              <InfoItem
                icon={<PhoneIcon className="h-5 w-5" />}
                label="Phone"
                value={phone}
              />
              <InfoItem label="Email" value={email} />
              <InfoItem
                icon={<MapPinIcon className="h-5 w-5" />}
                label="Location"
                value={`${country}, ${state} ${province}`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Lead Type" value={leadType} />
              <InfoItem label="Buying Intention" value={leadBuyingIntention} />
            </div>
            <InfoItem label="Project Summary" value={projectSummary} />
            <InfoItem label="Reason for Calling" value={reasonForCalling} />
            <InfoItem label="Want Complete System" value={wantCompleteSystem} />
            {wantCompleteSystem === "Yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<DollarSignIcon className="h-5 w-5" />}
                  label="Allocated Budget"
                  value={allocatedBudget}
                />
                <InfoItem label="Steps for Decision" value={stepsForDecision} />
              </div>
            )}
            <InfoItem
              icon={<CalendarIcon className="h-5 w-5" />}
              label="Expected ETA"
              value={expectedETA?.split("T")[0]}
            />
          </CardContent>
          <CardFooter>
            <SubmitButton width="100%" text="Submit" />
          </CardFooter>
        </Card>
      </form>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How would you like to proceed?</DialogTitle>
            <DialogDescription>
              Select an option to continue with the process
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                if (redirectOptions?.redirect1) {
                  router.push(redirectOptions.redirect1);
                }
              }}
            >
              Go to contact details
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (redirectOptions?.redirect2) {
                  router.push(redirectOptions.redirect2);
                }
              }}
            >
              Finish and return to the beginning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
