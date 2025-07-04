"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContactStore } from "@/store/contact-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createDeal } from "@/actions/contact/createDeal";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const createDealSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  amount: z.number().min(0, "Amount must be a positive number").default(0),
  shippingCost: z
    .number()
    .min(0, "Shipping cost must be a positive number")
    .default(0),
});

type CreateDealFormValues = z.infer<typeof createDealSchema>;

interface CreateDealButtonProps {
  contactId: string;
  ownerId: string;
}

export function CreateDealButton({
  contactId,
  ownerId,
}: CreateDealButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dealCreated, setDealCreated] = useState<string | null>(null);
  const { contact } = useContactStore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateDealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      firstName: contact?.firstname || "",
      lastName: contact?.lastname || "",
      amount: 0,
      shippingCost: 0,
    },
  });

  // Update form values when contact data changes
  useEffect(() => {
    if (contact?.firstname) {
      form.setValue("firstName", contact.firstname);
    }
    if (contact?.lastname) {
      form.setValue("lastName", contact.lastname);
    }
  }, [contact, form]);

  const onSubmit = async (data: CreateDealFormValues) => {
    setIsLoading(true);
    try {
      // Use the current user's ID as the owner ID (in a real app, you'd get this from context/session)
      // Replace with actual owner ID logic

      const dealData = await createDeal(
        contactId,
        data.firstName,
        data.lastName,
        ownerId,
        data.amount,
        data.shippingCost
      );

      if (dealData && dealData.id) {
        toast({
          title: "Success",
          description: "Deal created successfully",
        });
        setDealCreated(dealData.id);
      } else {
        throw new Error("Failed to create deal");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create deal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startProcess = () => {
    if (dealCreated) {
      router.push(`/forms/quick-quote/${contactId}/quote/${dealCreated}`);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Create New Deal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>

          {!dealCreated ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <input type="hidden" {...form.register("amount")} value="0" />
                <input
                  type="hidden"
                  {...form.register("shippingCost")}
                  value="0"
                />

                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Deal"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold mb-2">
                  Deal created successfully!
                </p>
                <p className="text-gray-500">
                  Your deal has been created. You can now start the process.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={startProcess}>Start Process</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
