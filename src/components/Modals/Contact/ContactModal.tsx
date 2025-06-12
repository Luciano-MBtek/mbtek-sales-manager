"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { OwnedContacts } from "@/app/my-contacts/myContacts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/app/my-contacts/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoTab from "./InfoTab";
import DealsTab from "./DealsTab";
import { GetContactById } from "@/actions/getContactById";
import { Loader2 } from "lucide-react";
import { patchContactProperties } from "@/actions/patchContactProperties";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import {
  contactUpdateSchema,
  ContactUpdateFormValues,
} from "@/schemas/contactUpdateSchema";
import EngagementsModalTab from "./EngagementsModalTab";
import NotesTab from "./NotesTab";

type ContactFormValues = ContactUpdateFormValues;

interface ContactModalProps {
  contactId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({
  contactId,
  isOpen,
  onClose,
}: ContactModalProps) {
  const [activeTab, setActiveTab] = useState("contact-info");
  const [contact, setContact] = useState<OwnedContacts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactUpdateSchema),
    defaultValues: {
      email: "",
      phone: "",
      company: "",
      lead_type: "",
      country_us_ca: "",
      address: "",
      province_territory: "",
      state_usa: "",
      city: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchContactData = async () => {
      if (!contactId) return;

      setIsLoading(true);
      setError(null);

      try {
        const contactData = await GetContactById(contactId);
        setContact(contactData);

        form.reset({
          email: contactData.properties.email || "",
          phone: contactData.properties.phone || "",
          company: contactData.properties.company || "",
          lead_type: contactData.properties.lead_type || "",
          country_us_ca: contactData.properties.country_us_ca || "",
          address: contactData.properties.address || "",
          province_territory: contactData.properties.province_territory || "",
          state_usa: contactData.properties.state_usa || "",
          city: contactData.properties.city || "",
        });
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact information");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && contactId) {
      fetchContactData();
    }
  }, [contactId, isOpen, form]);

  const handleSaveChanges = async (values: ContactFormValues) => {
    if (!contactId) return;

    setIsSaving(true);
    try {
      // Filtramos las propiedades que realmente han cambiado para no enviar datos innecesarios
      const changedProperties: Record<string, string> = {};

      Object.entries(values).forEach(([key, value]) => {
        const currentValue =
          contact?.properties[key as keyof typeof contact.properties];
        if (value !== currentValue && value !== "") {
          changedProperties[key] = value;
        }
      });

      if (Object.keys(changedProperties).length === 0) {
        toast({
          title: "No changes",
          description: "No changes were made to the contact",
        });

        return;
      }

      await patchContactProperties(contactId, changedProperties);
      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error("Error saving contact changes:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
      >
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <DialogTitle className="hidden">Loading...</DialogTitle>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading contact information...</span>
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : contact ? (
          <>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                <p>
                  {contact.properties?.firstname} {contact.properties?.lastname}
                </p>
              </DialogTitle>
              <span className="text-sm text-foreground">
                Created {formatDate(contact.properties?.createdate)}
              </span>
            </DialogHeader>

            <FormProvider {...form}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSaveChanges)}>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full mt-2"
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="contact-info">
                        Contact Info
                      </TabsTrigger>
                      <TabsTrigger value="deals">Deals</TabsTrigger>
                      <TabsTrigger value="engagements">Engagements</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <InfoTab />

                    <DealsTab contactId={contactId!} />

                    <EngagementsModalTab contactId={contactId!} />

                    <NotesTab contactId={contactId!} />
                  </Tabs>

                  <DialogFooter className="mt-4">
                    <Button variant="outline" type="button" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving || !form.formState.isDirty}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </FormProvider>
          </>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
            No contact information available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
