"use client";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import { WheelProgress } from "@/components/ui/wheel-progress";
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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ProductReviewCard from "@/components/ProductReviewCard";
import { useContactStore } from "@/store/contact-store";
import { HubspotIcon } from "@/components/HubspotIcon";

const ReviewFormSingleProduct = () => {
  const { singleProductData, resetLocalStorage } = useSingleProductContext();
  const { contact, update } = useContactStore();
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const { products } = singleProductData;

  const formData = {
    ...singleProductData,
    name: singleProductData.name || contact?.firstname || "",
    lastname: singleProductData.lastname || contact?.lastname || "",
    email: singleProductData.email || contact?.email || "",
    country: singleProductData.country || contact?.country || "",
    city: singleProductData.city || contact?.city || "",
    zip: singleProductData.zip || contact?.zip || "",
    address: singleProductData.address || contact?.address || "",
    id: contact?.id,
  };

  function parseSSEChunk(chunkStr: string) {
    const lines = chunkStr.split("\n");
    let currentEvent: string | null = null;
    let currentData: string | null = null;

    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.replace("event:", "").trim();
      } else if (line.startsWith("data:")) {
        currentData = line.replace("data:", "").trim();
      } else if (line === "") {
        if (currentEvent && currentData) {
          handleSSEEvent(currentEvent, currentData);
        }

        currentEvent = null;
        currentData = null;
      }
    }
  }

  function handleSSEEvent(eventName: string, data: string) {
    if (eventName === "progress") {
      try {
        const parsed = JSON.parse(data);
        setCurrentProgress(parsed.percentage || 0);
        setCurrentStep(parsed.step || "");
        setShowDialog(true);
      } catch (err) {
        setShowDialog(false);
      }
    } else if (eventName === "error") {
      const parsed = JSON.parse(data);

      setHasError(true);
      setShowDialog(false);
      toast({
        title: "Error",
        description: parsed.error || "Unknown error",
        variant: "destructive",
      });
    } else if (eventName === "complete") {
      try {
        const parsed = JSON.parse(data);

        setIsComplete(true);

        if (parsed.success) {
          toast({
            title: "Success",
            description: "Single product data submitted successfully",
          });
          setRedirectOptions({
            redirect1: parsed.redirect1,
            redirect2: parsed.redirect2,
          });
          resetLocalStorage();
        } else {
          setHasError(true);
          toast({
            title: "Error",
            description: "Process ended but success=false",
            variant: "destructive",
          });
        }
      } catch {
        setHasError(true);
        toast({
          title: "Error",
          description: "Error in completing the event.",
          variant: "destructive",
        });
      }
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);
    setIsSubmitting(true);

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });

        parseSSEChunk(chunkStr);
      }
    } catch (error) {
      console.error("Error in SSE:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-1 flex-col gap-2 items-stretch lg:max-w-full"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Lead Information for Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<HubspotIcon color="primary" />}
                label="Hubspot Id"
                value={formData.id}
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
              {formData.customShipment === "Yes" ? (
                <InfoItem
                  icon={<Truck className="h-5 w-5" />}
                  label="Shipment"
                  value={formData.shipmentCost}
                />
              ) : null}
            </div>

            {products ? (
              <ProductReviewCard products={products} />
            ) : (
              <p>No selected products.</p>
            )}
          </CardContent>

          <CardFooter>
            <SubmitButton
              width="100%"
              text={isSubmitting ? "Processing..." : "Submit"}
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
                    window.open(
                      "http://" + redirectOptions.redirect1,
                      "_blank"
                    );
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

export default ReviewFormSingleProduct;
