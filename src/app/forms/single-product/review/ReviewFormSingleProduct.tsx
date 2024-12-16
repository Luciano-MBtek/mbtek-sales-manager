"use client";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import { submitSingleProductAction } from "./actions";
import { newSingleProductType } from "@/schemas/singleProductSchema";

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
  Globe,
  Building,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
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

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const res = await submitSingleProductAction(
        singleProductData as newSingleProductType
      );
      const { redirect1, redirect2, errorMsg, success } = res;

      if (success) {
        toast({
          title: "Success",
          description: "Single product data submitted successfully",
        });

        setRedirectOptions({
          redirect1: redirect1,
          redirect2: redirect2,
        });
        resetLocalStorage();
        setShowDialog(true);
      } else if (errorMsg) {
        toast({
          title: "Error",
          description: `${errorMsg}`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
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
            <DialogTitle>The quote is ready and published.</DialogTitle>
            <DialogDescription>
              Select an option to continue with the process
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                if (redirectOptions?.redirect1) {
                  window.open("http://" + redirectOptions.redirect1, "_blank");
                }
              }}
            >
              Go to quote page.
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (redirectOptions?.redirect2) {
                  router.push(redirectOptions.redirect2);
                }
              }}
            >
              Back to main contact.
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewFormSingleProduct;
