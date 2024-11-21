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

const ReviewFormSingleProduct = () => {
  const { singleProductData, resetLocalStorage } = useSingleProductContext();
  const { contact, update } = useContactStore();
  const [redirectOptions, setRedirectOptions] = useState<{
    redirect1?: string;
    redirect2?: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { products } = singleProductData;

  const formData = {
    ...singleProductData,
    name: contact?.firstname || singleProductData.name || "",
    lastname: contact?.lastname || singleProductData.lastname || "",
    email: contact?.email || singleProductData.email || "",
    country: contact?.country || singleProductData.country || "",
    city: contact?.city || singleProductData.city || "",
    zip: contact?.zip || singleProductData.zip || "",
    address: contact?.address || singleProductData.address || "",
  };

  console.log(contact);

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitSingleProductAction(
      singleProductData as newSingleProductType
    );
    const { redirect1, redirect2, errorMsg, success } = res;

    console.log(res);

    if (success) {
      toast({
        title: "Success",
        description: "Single product data submitted successfully",
      });

      setRedirectOptions({
        redirect1: redirect1 ? redirect1 : undefined,
        redirect2: redirect2 ? redirect2 : undefined,
      });

      // resetLocalStorage()
      setShowDialog(true);
    } else if (errorMsg) {
      toast({
        title: "Error",
        description: `${errorMsg}`,
        variant: "destructive",
        duration: 3000,
      });
      if (redirect2) {
        router.push(redirect2);
      }
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
            <SubmitButton width="100%" text="Submit" />
          </CardFooter>
        </Card>
      </form>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>The quote will be created in minutes.</DialogTitle>
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
              Go to contact page.
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

export default ReviewFormSingleProduct;
