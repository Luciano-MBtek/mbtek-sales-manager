"use client";

import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Engagement } from "@/types/engagementsTypes";
import { Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEngagementIcon } from "../Contact/utils";
import { getDealEngagements } from "@/actions/deals/getDealEngagements";
import { createDealNote } from "@/actions/deals/createDealNote";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface EngagementsTabProps {
  dealId: string;
}

const noteFormSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(10240, { message: "Content cannot exceed 10,240 characters." }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

const EngagementsTab = ({ dealId }: EngagementsTabProps) => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();

  const userName = session.data?.user.name;

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (data: NoteFormValues) => {
    setIsSubmitting(true);
    try {
      const noteWithName = `${userName ? `${userName}:\n` : ""}${data.content}`;
      await createDealNote(dealId, noteWithName);
      form.reset();
      await fetchEngagements();
    } catch (err) {
      console.error("Error creating note:", err);
      setError("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchEngagements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDealEngagements(dealId);
      setEngagements(
        (data?.results || []).sort(
          (a: Engagement, b: Engagement) =>
            b.engagement.timestamp - a.engagement.timestamp
        )
      );
    } catch (err) {
      console.error("Error fetching engagements:", err);
      setError("Failed to load engagements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId]);

  return (
    <TabsContent value="engagements" className="mt-4 space-y-4">
      <Form {...form}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>New Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a note about this deal..."
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="button"
          className="w-full mt-2"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Note...
            </>
          ) : (
            "Add Note"
          )}
        </Button>
      </Form>

      {loading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading engagements...
          </span>
        </div>
      ) : error ? (
        <div className="min-h-[200px] flex items-center justify-center text-destructive">
          {error}
        </div>
      ) : engagements.length > 0 ? (
        <ScrollArea className="h-[390px] pr-2">
          <div className="space-y-3">
            {engagements.map((engagement) => (
              <Card key={engagement.engagement.id} className="overflow-hidden">
                <CardHeader className="py-2 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-full p-1.5">
                        {getEngagementIcon(engagement.engagement.type)}
                      </div>
                      <CardTitle className="text-sm font-medium">
                        {engagement.metadata.title ||
                          engagement.engagement.type}
                      </CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        engagement.engagement.timestamp
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4 text-xs text-muted-foreground line-clamp-3">
                  {engagement.engagement.bodyPreview}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed">
          <Mail className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
          <p className="text-muted-foreground">
            No engagements found for this deal
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default EngagementsTab;
