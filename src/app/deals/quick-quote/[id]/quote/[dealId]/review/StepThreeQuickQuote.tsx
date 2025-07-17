"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import InfoItem from "@/components/InfoItem";
import {
  User,
  Mail,
  MapPin,
  Home,
  Map,
  Hash,
  CreditCard,
  Truck,
  Globe,
  Building,
  ArrowRight,
  Phone,
} from "lucide-react";
import { HubspotIcon } from "@/components/HubspotIcon";
import ProductReviewCard from "@/components/ProductReviewCard";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rate } from "@/types";
import Shopify from "@/components/Icons/Shopify";
import { WheelProgress } from "@/components/ui/wheel-progress";
import { createFormSubmitHandler } from "@/lib/sse";
import { Quote } from "@/types/quoteTypes";
import { LineItem } from "@/types/dealTypes";
import QuoteDetailsCard from "@/components/Quote/QuoteDetailsCard";

interface StepThreeQuickQuoteProps {
  dealId: string;
  contactId: string;
  dealOwnerId: string;
  contact: any;
  products: any[];
  splitPayment: string;
  purchaseOptionId: string;
  purchaseOptions: Array<{ label: string; value: string }>;
  mainProduct?: string;
  draftOrderId?: string;
  quoteId?: string;
  quoteDetails?: (Quote & { lineItems?: LineItem[] }) | null;
}

const StepThreeQuickQuote = ({
  dealId,
  contactId,
  contact,
  dealOwnerId,
  products,
  splitPayment,
  purchaseOptionId,
  purchaseOptions,
  mainProduct,
  draftOrderId,
  quoteId,
  quoteDetails,
}: StepThreeQuickQuoteProps) => {
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Rate | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  const ratesParam = searchParams.get("rates");

  const hasQuote = quoteId !== undefined;
  const quoteLink = quoteDetails?.properties.hs_quote_link;
  const quoteLineItems = quoteDetails?.lineItems;
  const newMainProductSku =
    products.find((product) => product.isMain === true)?.sku || "";

  const updateMainProduct = mainProduct !== newMainProductSku;
  const newMainProduct = updateMainProduct ? newMainProductSku : undefined;

  const decodedRates = useMemo(() => {
    const parsedRates = ratesParam
      ? JSON.parse(decodeURIComponent(ratesParam || "[]"))
      : [];
    return parsedRates.length > 0
      ? parsedRates.map((rate: Rate) => ({
          ...rate,
          costLoaded:
            rate.costLoaded === 0 ? 0 : Math.ceil(rate.costLoaded * 1.1) + 65,
        }))
      : [];
  }, [ratesParam]);

  useEffect(() => {
    if (decodedRates?.length > 0 && !selectedShipment) {
      setSelectedShipment(decodedRates[0]);
    }
  }, [decodedRates, selectedShipment]);

  const [formData, setFormData] = useState({
    dealId,
    contactId,
    dealOwnerId,
    name: contact.properties.firstname,
    lastname: contact.properties.lastname,
    email: contact.properties.email,
    phone: contact.properties.phone,
    country: contact.properties.country_us_ca,
    city: contact.properties.city,
    zip: contact.properties.zip,
    address: contact.properties.address,
    state: contact.properties.state,
    province: contact.properties.province,
    splitPayment,
    purchaseOptionId,
    products,
    shipmentCost: selectedShipment?.costLoaded || null,
  });

  const contactData = {
    firstname: contact.properties.firstname,
    lastname: contact.properties.lastname,
    email: contact.properties.email,
    phone: contact.properties.phone,
    country_us_ca: contact.properties.country_us_ca,
    city: contact.properties.city,
    zip: contact.properties.zip,
    address: contact.properties.address,
    state_usa: contact.properties.state,
    province: contact.properties.province,
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipmentCost: selectedShipment?.costLoaded || null,
    }));
  }, [selectedShipment]);

  const handleFormSubmit = createFormSubmitHandler(
    "/api/generate-quick-quote",
    {
      setIsSubmitting,
      setHasError,
      setIsComplete,
      setCurrentProgress,
      setCurrentStep,
      setShowDialog,
      setRedirectOptions,
      toast,
      resetLocalStorage: () => {},
    }
  );

  const handleFormUpdate = createFormSubmitHandler("/api/update-quick-quote", {
    setIsSubmitting,
    setHasError,
    setIsComplete,
    setCurrentProgress,
    setCurrentStep,
    setShowDialog,
    setRedirectOptions,
    toast,
    resetLocalStorage: () => {},
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          if (hasQuote) {
            handleFormUpdate(e, {
              dealId,
              contactId,
              quoteId,
              quoteLink,
              draftOrderId,
              quoteLineItems,
              newMainProduct,
              products,
              splitPayment,
              purchaseOptionId,
              contactData,
              shipmentCost: selectedShipment?.costLoaded || null,
              dealOwnerId,
            });
          } else {
            handleFormSubmit(e, formData);
          }
        }}
        className="flex flex-1 flex-col gap-2 items-stretch lg:max-w-full p-4"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Quick Quote Review
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<HubspotIcon color="primary" />}
                label="Hubspot Id"
                value={contactId}
              />
              <InfoItem
                icon={<User className="h-5 w-5" />}
                label="Name"
                value={`${formData.name} ${formData.lastname}`}
              />
              <InfoItem
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={formData.email}
              />
              <InfoItem
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={formData.phone}
              />
              <InfoItem
                icon={<Globe className="h-5 w-5" />}
                label="Country"
                value={formData.country}
              />
              {formData.state && (
                <InfoItem
                  icon={<Map className="h-5 w-5" />}
                  label="State"
                  value={formData.state}
                />
              )}
              {formData.province && (
                <InfoItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Province"
                  value={formData.province}
                />
              )}
              <InfoItem
                icon={<Building className="h-5 w-5" />}
                label="City"
                value={formData.city}
              />
              <InfoItem
                icon={<Home className="h-5 w-5" />}
                label="Address"
                value={formData.address}
              />
              <InfoItem
                icon={<Hash className="h-5 w-5" />}
                label="ZIP Code"
                value={formData.zip}
              />
              <InfoItem
                icon={<CreditCard className="h-5 w-5" />}
                label="Split Payment"
                value={formData.splitPayment === "Yes" ? "Yes" : "No"}
              />
              {formData.splitPayment === "Yes" && (
                <InfoItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Purchase Option"
                  value={
                    purchaseOptions.find(
                      (option) => option.value === purchaseOptionId
                    )?.label || ""
                  }
                />
              )}

              {decodedRates && decodedRates.length > 0 ? (
                <div className="space-y-3">
                  <Label
                    htmlFor="shipping-options"
                    className="flex items-center gap-2"
                  >
                    <Truck className="h-5 w-5" />
                    <span>Shipping Options</span>
                  </Label>
                  <Select
                    value={selectedShipment?.carrierScac || ""}
                    onValueChange={(value) => {
                      const selectedOption = decodedRates.find(
                        (rate: Rate) => rate.carrierScac === value
                      );
                      setSelectedShipment(selectedOption || null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a shipping option" />
                    </SelectTrigger>
                    <SelectContent>
                      {decodedRates.map((rate: Rate, index: number) => (
                        <SelectItem key={index} value={rate.carrierScac}>
                          {rate.carrierScac} - ${rate.costLoaded.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedShipment && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="font-semibold">Selected Shipping Option:</p>
                      <p>Cost: ${selectedShipment.costLoaded.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <InfoItem
                  icon={
                    <div className="flex gap-2 items-center">
                      <Truck className="h-5 w-5" />
                      <ArrowRight />
                      <Shopify />
                    </div>
                  }
                  label="Shipment"
                  value={`Defined by Shopify`}
                />
              )}
            </div>

            {quoteDetails && <QuoteDetailsCard quoteDetails={quoteDetails} />}

            {products && products.length > 0 ? (
              <ProductReviewCard
                products={products}
                customShipment={selectedShipment?.costLoaded}
              />
            ) : (
              <p>No selected products.</p>
            )}
          </CardContent>

          <CardFooter>
            <SubmitButton
              width="100%"
              text={
                isSubmitting
                  ? "Processing..."
                  : hasQuote
                    ? "Update Quote"
                    : "Publish Quote"
              }
              disabled={isSubmitting}
            />
          </CardFooter>
        </Card>
      </form>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!isComplete
                ? "Processing Quote"
                : hasError
                  ? "Error Processing Quote"
                  : "The quote is ready and published"}
            </DialogTitle>
            {!isComplete && (
              <DialogDescription>
                Please wait while we process your quote...
              </DialogDescription>
            )}
            {isComplete && !hasError && (
              <DialogDescription>
                Select an option to continue with the process
              </DialogDescription>
            )}
          </DialogHeader>

          {currentProgress > 0 && (
            <div className="flex flex-col items-center gap-4 py-4">
              <WheelProgress value={currentProgress} size="lg" />
              <p className="text-center text-muted-foreground">{currentStep}</p>
            </div>
          )}

          {isComplete && !hasError && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  if (redirectOptions?.redirect1) {
                    const url = redirectOptions.redirect1.startsWith("http")
                      ? redirectOptions.redirect1
                      : `https://${redirectOptions.redirect1}`;
                    window.open(url, "_blank");
                  }
                }}
              >
                Go to quote page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (redirectOptions?.redirect2) {
                    router.push(redirectOptions.redirect2);
                  }
                }}
              >
                Back to main contact
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StepThreeQuickQuote;
