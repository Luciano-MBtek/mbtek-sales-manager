import { Fragment, useState, useMemo } from "react";
import { useParams } from "next/navigation";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GetPropertyDetail } from "@/actions/getPropertyDetail";
import { PropertyDetail } from "../../types";

import { TextForm } from "./FormsProperties/TextForm";
import { TextAreaForm } from "./FormsProperties/TextAreaForm";
import { SelectForm } from "./FormsProperties/SelectForm";
import { RadioForm } from "./FormsProperties/RadioForm";
import { CheckboxForm } from "./FormsProperties/CheckboxForm";

export function DialogCloseButton({
  property,
  friendlyName,
  onDialogClose,
}: {
  property: string;
  friendlyName: string;
  onDialogClose: () => void;
}) {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetail | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const { id } = params;

  const loadPropertyDetails = async () => {
    if (!propertyDetails) {
      setIsLoading(true);
      try {
        const details = await GetPropertyDetail(property);

        setPropertyDetails(details);
      } catch (error) {
        console.error("Error loading property details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const propertyFieldTypes = useMemo(
    () => ({
      readOnly: propertyDetails?.modificationMetadata?.readOnlyValue ?? false,
      selectable: propertyDetails?.fieldType === "select",
      radio: propertyDetails?.fieldType === "radio",
      text: propertyDetails?.fieldType === "text",
      textArea: propertyDetails?.fieldType === "textarea",
      checkBox: propertyDetails?.fieldType === "checkbox",
    }),
    [propertyDetails]
  );

  const propertyOptions = {
    options: propertyDetails?.options,
    label: propertyDetails?.label,
  };

  const renderInputField = () => {
    const { readOnly } = propertyFieldTypes;
    const { options, label } = propertyOptions;

    if (readOnly) {
      return <p>Read only property, cannot be changed.</p>;
    }

    const fieldTypeMap: Record<string, JSX.Element> = {
      selectable: (
        <SelectForm
          options={options ?? []}
          label={label ?? ""}
          property={property}
          id={id}
        />
      ),
      radio: (
        <RadioForm
          options={options ?? []}
          label={label ?? ""}
          property={property}
          id={id}
        />
      ),
      text: <TextForm label={label ?? ""} property={property} id={id} />,
      textArea: (
        <TextAreaForm label={label ?? ""} property={property} id={id} />
      ),
      checkBox: (
        <CheckboxForm
          options={options ?? []}
          label={label ?? ""}
          property={property}
          id={id}
        />
      ),
    };

    return Object.entries(propertyFieldTypes)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => <Fragment key={key}>{fieldTypeMap[key]}</Fragment>);
  };

  return (
    <DialogContent
      className="sm:max-w-md"
      onOpenAutoFocus={loadPropertyDetails}
    >
      <DialogHeader>
        <DialogTitle>{friendlyName}</DialogTitle>
        <DialogDescription>
          {isLoading
            ? "Loading property details..."
            : propertyDetails?.description || "No description available."}
        </DialogDescription>
      </DialogHeader>
      {!isLoading && propertyDetails && (
        <div className="flex items-center space-x-2">{renderInputField()}</div>
      )}
      <DialogFooter className="sm:justify-start">
        {/* <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose> */}
      </DialogFooter>
    </DialogContent>
  );
}
