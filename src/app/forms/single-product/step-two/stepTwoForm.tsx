"use client";
import { useFormState } from "react-dom";
import { stepTwoFormSingleProductAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useSingleProductContext } from "@/contexts/singleProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoItem from "@/components/InfoItem";
import { MailIcon, UserIcon } from "lucide-react";
import { SideProductSheet } from "@/components/SideProductSheet";

const initialState: FormErrors = {};

export default function StepSingleProductTwoForm() {
  const { singleProductData, updateSingleProductDetails, dataLoaded } =
    useSingleProductContext();
  const [serverErrors, formAction] = useFormState(
    stepTwoFormSingleProductAction,
    initialState
  );

  const formData = {
    ...singleProductData,
    name: singleProductData.name || "",
    lastname: singleProductData.lastname || "",
    email: singleProductData.email || "",
  };

  return (
    <div>
      <div className="p-4">
        <Card className="shadow-lg w-full  lg:max-w-[700px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Lead Information - Select Products
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Name"
                value={`${formData.name} ${formData.lastname}`}
              />
              <InfoItem
                icon={<MailIcon className="h-5 w-5" />}
                label="Email"
                value={formData.email}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <form
        action={formAction}
        className="flex flex-1 flex-col items-center p-4"
      >
        <SideProductSheet />
        <div className="flex w-full flex-col gap-4 lg:max-w-[700px] ">
          <SubmitButton text="Continue" />
        </div>
      </form>
    </div>
  );
}
