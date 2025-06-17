"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/StepIndicator";
import BuildingNeedsContent from "./BuildingNeedsContent";
import ZonesInformationContent from "./ZonesInformationContent";
import DocumentationContent from "./DocumentationContent";
import QuoteBillingContent from "./QuoteBillingContent";
import ShippingContent, { ShippingFormValues } from "./ShippingContent";
import { useToast } from "@/components/ui/use-toast";
import { patchDealProperties } from "@/actions/contact/patchDealProperties";

type TechnicalStep =
  | "building-needs"
  | "zones-information"
  | "step-3"
  | "step-4"
  | "step-5";

const STEPS: Array<{ id: TechnicalStep; label: string }> = [
  { id: "building-needs", label: "Building needs" },
  { id: "zones-information", label: "Zones Information" },
  { id: "step-3", label: "Documentation" },
  { id: "step-4", label: "Quote & Billing" },
  { id: "step-5", label: "Shipping" },
];

interface TechnicalInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactData: any;
  dealData: any;
  files: any;
}

export function TechnicalInformationModal({
  isOpen,
  onClose,
  contactData,
  dealData,
  files,
}: TechnicalInformationModalProps) {
  const [currentStep, setCurrentStep] = useState<TechnicalStep>(
    dealData?.properties?.last_step || "building-needs"
  );
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { toast } = useToast();

  const getInitialFormData = () => ({
    "building-needs": {
      yearOfConstruction: dealData?.properties?.year_of_construction || "",
      insulationType: dealData?.properties?.insulation_type || "",
      specificNeeds:
        dealData?.properties?.specific_needs?.split(";").filter(Boolean) || [],
      otherSpecificNeed: dealData?.properties?.other_specific_need || "",
      isOtherSelected: Boolean(dealData?.properties?.other_specific_need),
      installationResponsible:
        dealData?.properties?.installation_responsible || "",
    },
    "zones-information": {
      numberOfZones: dealData?.properties?.number_of_zones || "1",
      zones: dealData?.properties?.zones_configuration
        ? JSON.parse(dealData.properties.zones_configuration)
        : [{ name: "", size: "", distribution: "" }],
    },
    "step-3": {
      ...dealData,
      properties: {
        ...dealData?.properties,
        documentation_files: dealData?.properties?.documentation_files || [],
        documentation_notes: dealData?.properties?.documentation_notes || "",
      },
    },
    "step-4": {
      zipCode:
        dealData?.properties?.billing_zip || contactData?.properties?.zip || "",
      firstName:
        dealData?.properties?.billing_first_name ||
        contactData?.properties?.firstname ||
        "",
      lastName:
        dealData?.properties?.billing_last_name ||
        contactData?.properties?.lastname ||
        "",
      email:
        dealData?.properties?.billing_email ||
        contactData?.properties?.email ||
        "",
      phone:
        dealData?.properties?.billing_phone ||
        contactData?.properties?.phone ||
        "",
      address:
        dealData?.properties?.billing_address ||
        contactData?.properties?.address ||
        "",
      city:
        dealData?.properties?.billing_city ||
        contactData?.properties?.city ||
        "",
      state:
        dealData?.properties?.billing_state ||
        contactData?.properties?.state ||
        "",
      country:
        dealData?.properties?.billing_country ||
        contactData?.properties?.country ||
        "",
    },
    "step-5": {
      delivery_type: dealData?.properties?.delivery_type || "",
      dropoff_condition: dealData?.properties?.dropoff_condition || "",
      firstName:
        dealData?.properties?.shipping_first_name ||
        contactData?.properties?.firstname ||
        "",
      lastName:
        dealData?.properties?.shipping_last_name ||
        contactData?.properties?.lastname ||
        "",
      email:
        dealData?.properties?.shipping_email ||
        contactData?.properties?.email ||
        "",
      phone:
        dealData?.properties?.shipping_phone ||
        contactData?.properties?.phone ||
        "",
      shipping_address:
        dealData?.properties?.shipping_address ||
        contactData?.properties?.shipping_address ||
        "",
      shipping_city:
        dealData?.properties?.shipping_city ||
        contactData?.properties?.shipping_city ||
        "",
      shipping_country:
        dealData?.properties?.shipping_country ||
        contactData?.properties?.shipping_country ||
        "",
      shipping_province:
        dealData?.properties?.shipping_province ||
        contactData?.properties?.shipping_province ||
        "",
      shipping_zip_code:
        dealData?.properties?.shipping_zip_code ||
        contactData?.properties?.shipping_zip_code ||
        "",
    },
  });

  const [formData, setFormData] =
    useState<Record<string, any>>(getInitialFormData());

  // Actualizar formData si dealData o contactData cambian
  useEffect(() => {
    setFormData(getInitialFormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealData, contactData]);

  // Actualizar currentStep cuando cambie dealData
  useEffect(() => {
    if (dealData?.properties?.last_step) {
      setCurrentStep(dealData.properties.last_step as TechnicalStep);
    }
  }, [dealData]);

  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  const handleBack = () => {
    if (currentStepIndex === 0) {
      onClose();
    } else {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleContinue = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleStepComplete = async (stepData: any) => {
    setIsSaving(true);
    try {
      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentStep]: stepData,
      }));

      // Update deal in HubSpot based on current step
      if (currentStep === "building-needs") {
        await patchDealProperties(dealData.id, {
          year_of_construction: Number(stepData.yearOfConstruction),
          insulation_type: stepData.insulationType,
          specific_needs: stepData.specificNeeds.join(";"),
          other_specific_need: stepData.otherSpecificNeed || "",
          installation_responsible: stepData.installationResponsible,
          last_step: STEPS[currentStepIndex + 1].id,
        });
      } else if (currentStep === "zones-information") {
        const zonesData = {
          number_of_zones: stepData.numberOfZones,
          zones_configuration: JSON.stringify(stepData.zones),
          last_step: STEPS[currentStepIndex + 1].id,
        };
        console.log("Saving zones data to HubSpot:", zonesData);
        await patchDealProperties(dealData.id, zonesData);
      } else if (currentStep === "step-3") {
        setFormData((prev) => ({
          ...prev,
          [currentStep]: {
            files: stepData.files,
            existingFileIds: stepData.existingFileIds,
          },
        }));
        await patchDealProperties(dealData.id, {
          last_step: STEPS[currentStepIndex + 1].id,
        });
      } else if (currentStep === "step-4") {
        const billingData = {
          billing_zip: stepData.zipCode,
          billing_first_name: stepData.firstName,
          billing_last_name: stepData.lastName,
          billing_email: stepData.email,
          billing_phone: stepData.phone,
          billing_address: stepData.address,
          billing_city: stepData.city,
          billing_state: stepData.state,
          billing_country: stepData.country,
          last_step: STEPS[currentStepIndex + 1].id,
        };
        await patchDealProperties(dealData.id, billingData);
      } else if (currentStep === "step-5") {
        const shippingData = {
          shipping_first_name: stepData.shipping_first_name,
          shipping_last_name: stepData.shipping_last_name,
          shipping_email: stepData.shipping_email,
          shipping_phone: stepData.shipping_phone,
          shipping_address: stepData.shipping_address,
          shipping_city: stepData.shipping_city,
          shipping_country: stepData.shipping_country,
          shipping_province: stepData.shipping_province,
          shipping_zip_code: stepData.shipping_zip_code,
          delivery_type: stepData.delivery_type,
          dropoff_condition: stepData.dropoff_condition,
          last_step: currentStep,
        };
        await patchDealProperties(dealData.id, shippingData);
      }

      // Show success message
      toast({
        title: "Step Saved",
        description: "Information saved successfully.",
      });

      // Move to next step if not in last step
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentStepIndex + 1].id);
      } else {
        // Si es el último paso, cerrar el modal
        onClose();
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "There was an error saving the information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "building-needs":
        return (
          <BuildingNeedsContent
            onComplete={handleStepComplete}
            initialData={
              formData[currentStep] || {
                yearOfConstruction:
                  dealData?.properties?.year_of_construction || "",
                insulationType: dealData?.properties?.insulation_type || "",
                specificNeeds:
                  dealData?.properties?.specific_needs
                    ?.split(";")
                    .filter(Boolean) || [],
                otherSpecificNeed:
                  dealData?.properties?.other_specific_need || "",
                isOtherSelected: Boolean(
                  dealData?.properties?.other_specific_need
                ),
                installationResponsible:
                  dealData?.properties?.installation_responsible || "",
              }
            }
            formRef={formRef}
          />
        );
      case "zones-information":
        return (
          <ZonesInformationContent
            onComplete={handleStepComplete}
            initialData={
              formData[currentStep] || {
                numberOfZones: dealData?.properties?.number_of_zones || "1",
                zones: dealData?.properties?.zones_configuration
                  ? JSON.parse(dealData.properties.zones_configuration)
                  : [{ name: "", size: "", distribution: "" }],
              }
            }
            formRef={formRef}
          />
        );
      case "step-3": {
        const docData = files.map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.url,
        }));

        const currentStepData = formData[currentStep] || {};
        const existingFiles = currentStepData.files || docData;

        return (
          <DocumentationContent
            onComplete={handleStepComplete}
            formRef={formRef}
            dealId={dealData.id}
            initialData={existingFiles}
          />
        );
      }
      case "step-4":
        return (
          <QuoteBillingContent
            onComplete={handleStepComplete}
            initialData={
              formData[currentStep] || {
                zipCode: contactData?.properties?.zip || "",
                firstName: contactData?.properties?.firstname || "",
                lastName: contactData?.properties?.lastname || "",
                email: contactData?.properties?.email || "",
                phone: contactData?.properties?.phone || "",
                address: contactData?.properties?.address || "",
                city: contactData?.properties?.city || "",
                state: contactData?.properties?.state || "",
                country: contactData?.properties?.country || "",
              }
            }
            formRef={formRef}
          />
        );
      case "step-5": {
        const shippingInitialData: Partial<ShippingFormValues> = {
          delivery_type: dealData?.properties?.delivery_type || "",
          dropoff_condition: dealData?.properties?.dropoff_condition || "",
          shipping_first_name:
            dealData?.properties?.shipping_first_name ||
            contactData?.properties?.firstname ||
            "",
          shipping_last_name:
            dealData?.properties?.shipping_last_name ||
            contactData?.properties?.lastname ||
            "",
          shipping_email:
            dealData?.properties?.shipping_email ||
            contactData?.properties?.email ||
            "",
          shipping_phone:
            dealData?.properties?.shipping_phone ||
            contactData?.properties?.phone ||
            "",
          shipping_address:
            dealData?.properties?.shipping_address ||
            contactData?.properties?.shipping_address ||
            "",
          shipping_city:
            dealData?.properties?.shipping_city ||
            contactData?.properties?.shipping_city ||
            "",
          shipping_country:
            dealData?.properties?.shipping_country ||
            contactData?.properties?.shipping_country ||
            "",
          shipping_province:
            dealData?.properties?.shipping_province ||
            contactData?.properties?.shipping_province ||
            "",
          shipping_zip_code:
            dealData?.properties?.shipping_zip_code ||
            contactData?.properties?.shipping_zip_code ||
            "",
        };

        return (
          <ShippingContent
            onComplete={handleStepComplete}
            initialData={shippingInitialData}
            billingData={formData["step-4"]}
            formRef={formRef}
          />
        );
      }
      default:
        return <p>Step under construction: {currentStep}</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-[#0f172a] text-white p-4 -mx-6 -mt-6">
            Deal - Information Collection
          </DialogTitle>
        </DialogHeader>

        <StepIndicator
          steps={STEPS.length}
          currentStep={currentStepIndex + 1}
          labels={STEPS.map((step) => step.label)}
        />

        {/* Step content */}
        <div className="py-4">
          <div className="mb-6">
            <h2 className="text-lg font-medium">
              Step {currentStepIndex + 1}: {STEPS[currentStepIndex].label}
            </h2>
          </div>
          {renderStepContent()}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-[100px]"
            disabled={isSaving}
          >
            {currentStepIndex === 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={handleContinue}
            className="w-[100px] bg-[#0f172a]"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : currentStepIndex === STEPS.length - 1
                ? "Complete"
                : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
