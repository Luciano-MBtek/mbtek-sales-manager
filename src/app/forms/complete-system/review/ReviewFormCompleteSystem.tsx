"use client";
import InfoItem from "@/components/InfoItem";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompleteSystem, useSystemStore } from "@/store/completeSystem-store";
import { useContactStore } from "@/store/contact-store";

import { MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitCompleteSystemAction } from "./actions";
import { CompleteSystemType } from "@/schemas/completeSystemSchema";
import { useToast } from "@/components/ui/use-toast";
import UsaFlag from "@/components/utils/UsaFlag";
import CanadaFlag from "@/components/utils/CanadaFlag";

const ReviewFormCompleteSystem = () => {
  const router = useRouter();
  const { completeSystem, update: updateSystem } = useSystemStore();
  const { toast } = useToast();
  const { contact } = useContactStore();

  const [showDialog, setShowDialog] = useState(false);
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);

  const { email, firstname, lastname, phone, country, province, state } =
    contact ?? {};

  const {
    zip,
    city,
    interested_to_be_financed,
    confirmed_prior_attempt,
    installation_type,
    unit_replacement_type,
    technology_needed_main_system,
    technology_needed,
    prospect_valued_benefits,
    who_is_the_installer_,
    buildings_involved_data,
    competitors_feedback,
    address,
  } = completeSystem ?? {};

  const handleFormSubmit = async (formData: FormData) => {
    if (!completeSystem) return;
    const res = await submitCompleteSystemAction(completeSystem);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Name"
                value={`${firstname} ${lastname}`}
              />
              <InfoItem
                icon={<PhoneIcon className="h-5 w-5" />}
                label="Phone"
                value={phone}
              />
              <InfoItem label="Email" value={email} />
              <InfoItem
                label="Interested to be financed"
                value={interested_to_be_financed}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
          </CardContent>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={country === "USA" ? <UsaFlag /> : <CanadaFlag />}
                label="Location"
                value={`${country}, ${state || province}`}
              />
              <InfoItem label="Address" value={address} />
              <InfoItem label="City" value={city} />
              <InfoItem label="Zip" value={zip} />
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle className="text-2xl font-bold">System Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Installation Type" value={installation_type} />
              {unit_replacement_type && (
                <InfoItem
                  label="Replacement Type"
                  value={unit_replacement_type.join(", ")}
                />
              )}
              <InfoItem
                label="Technology"
                value={technology_needed_main_system || technology_needed}
              />
              <InfoItem
                label="Valued Benefits"
                value={prospect_valued_benefits}
              />
              <InfoItem label="Installer" value={who_is_the_installer_} />
              <InfoItem
                label="Confirmed prior attempt"
                value={confirmed_prior_attempt}
              />
            </div>

            {buildings_involved_data && (
              <div>
                <h3 className="font-semibold mb-2">Zones</h3>
                <div className="grid grid-cols-1 gap-2">
                  {buildings_involved_data.map((zone, index) => (
                    <div key={index} className="border p-2 rounded">
                      <p>Zone: {zone.zone_name}</p>
                      <p>Area: {zone.sqft} sq ft</p>
                      <p>Type: {zone.selected_option}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
};

export default ReviewFormCompleteSystem;
