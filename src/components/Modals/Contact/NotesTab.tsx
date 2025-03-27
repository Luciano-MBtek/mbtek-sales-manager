"use client";

import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Loader2, Notebook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEngagementsById } from "@/actions/getEngagementsById";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/actions/createNote";

type Engagement = {
  engagement: {
    id: number;
    type: string;
    timestamp: number;
    bodyPreview: string;
  };
  metadata: {
    body: string;
    html: string;
    text: string;
    title: string;
    status: string;
  };
};

interface NotesTabProps {
  contactId: string;
}

const noteFormSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(10240, { message: "Content cannot exceed 10,240 characters." }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

const isHTML = (str: string): boolean => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

const NotesTab = ({ contactId }: NotesTabProps) => {
  const [notes, setNotes] = useState<Engagement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const engagements = await getEngagementsById(contactId);

        const noteEngagements = (engagements.results || [])
          .filter(
            (engagement: Engagement) => engagement.engagement.type === "NOTE"
          )
          .sort(
            (a: Engagement, b: Engagement) =>
              b.engagement.timestamp - a.engagement.timestamp
          );

        setNotes(noteEngagements);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [contactId]);

  const onSubmit = async (data: NoteFormValues) => {
    setIsSubmitting(true);
    try {
      await createNote(contactId, data.content);

      // Reset the form after successful submission
      form.reset();

      // Refetch notes after creating a new one
      const engagements = await getEngagementsById(contactId);
      const noteEngagements = (engagements.results || [])
        .filter(
          (engagement: Engagement) => engagement.engagement.type === "NOTE"
        )
        .sort(
          (a: Engagement, b: Engagement) =>
            b.engagement.timestamp - a.engagement.timestamp
        );

      setNotes(noteEngagements);
    } catch (error) {
      console.error("Error creating note:", error);
      setError("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="notes" className="mt-4 space-y-4">
      <div className="space-y-4 min-h-[400px]">
        <Form {...form}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a note about this contact..."
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Note...
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </Form>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Notes History</h3>
          {isLoading ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading notes...
              </span>
            </div>
          ) : error ? (
            <div className="min-h-[200px] flex items-center justify-center text-destructive">
              {error}
            </div>
          ) : notes.length > 0 ? (
            <ScrollArea className="h-[170px] pr-2 w-full">
              <div className="flex flex-col space-y-3 max-w-[720px]">
                {notes.map((note) => (
                  <Card key={note.engagement.id} className="overflow-hidden">
                    <CardHeader className="py-2 px-4 ">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted rounded-full p-1.5">
                            <Notebook className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm font-medium">
                            {note.metadata.title || "Note"}
                          </CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(
                            note.engagement.timestamp
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="text-xs">
                        {isHTML(note.metadata.body) ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: note.metadata.body,
                            }}
                          />
                        ) : (
                          <div className="w-full">
                            {note.metadata.body
                              .split(/(\d+\s*-\s*)/)
                              .map((part, index) =>
                                part.match(/^\d+\s*-\s*$/) ? (
                                  <p key={index}>
                                    {part}
                                    <br key={`br-${index}`} />
                                  </p>
                                ) : (
                                  part
                                )
                              )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
              No notes found for this contact
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default NotesTab;
