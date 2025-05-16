// src/lib/sse.ts
import { FormEvent } from "react";

// Types for SSE event handlers
export interface SSEProgressEvent {
  percentage: number;
  step: string;
  quoteUrl?: string;
}

export interface SSECompleteEvent {
  success: boolean;
  redirect1?: string;
  redirect2?: string;
  contactId?: string;
}

export interface SSEErrorEvent {
  error: string;
}

export interface SSEHandlerOptions {
  onProgress: (data: SSEProgressEvent) => void;
  onComplete: (data: SSECompleteEvent) => void;
  onError: (data: SSEErrorEvent) => void;
  endpoint: string;
  formData: any;
}

export interface SSEHookOptions {
  setIsSubmitting: (value: boolean) => void;
  setHasError: (value: boolean) => void;
  setIsComplete: (value: boolean) => void;
  setCurrentProgress: (value: number) => void;
  setCurrentStep: (value: string) => void;
  setShowDialog: (value: boolean) => void;
  setRedirectOptions?: (options: {
    redirect1?: string;
    redirect2?: string;
  }) => void;
  toast: any;
  resetLocalStorage?: () => void;
}

/**
 * Parse a chunk of SSE data
 */
export function parseSSEChunk(
  chunkStr: string,
  handleSSEEvent: (eventName: string, data: string) => void
) {
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

/**
 * Create an SSE event handler based on the provided options
 */
export function createSSEEventHandler(options: SSEHookOptions) {
  return async function handleSSEEvent(eventName: string, data: string) {
    const {
      setIsComplete,
      setHasError,
      setCurrentProgress,
      setCurrentStep,
      setShowDialog,
      setRedirectOptions,
      toast,
      resetLocalStorage,
    } = options;

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
          await fetch("/api/revalidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paths: [
                `/contacts/${parsed.contactId}`,
                `/contacts/${parsed.contactId}/properties`,
                `/contacts/${parsed.contactId}/deals`,
                `/contacts/${parsed.contactId}/quotes`,
              ],
              tags: ["quotes", "contact-deals"],
            }),
          });
          toast({
            title: "Success",
            description: "Quote data processed successfully",
          });

          if (setRedirectOptions) {
            setRedirectOptions({
              redirect1: parsed.redirect1,
              redirect2: parsed.redirect2,
            });
          }

          if (resetLocalStorage) {
            resetLocalStorage();
          }
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
  };
}

/**
 * Create a form submit handler with SSE
 */
export function createFormSubmitHandler(
  endpoint: string,
  options: SSEHookOptions
) {
  const { setHasError, setIsSubmitting, toast } = options;

  return async function handleFormSubmit(
    e: FormEvent<HTMLFormElement>,
    formData: any
  ) {
    e.preventDefault();

    setHasError(false);
    setIsSubmitting(true);

    try {
      const resp = await fetch(endpoint, {
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
      const handleSSEEvent = createSSEEventHandler(options);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        parseSSEChunk(chunkStr, handleSSEEvent);
      }
    } catch (error) {
      console.error(`Error in SSE with endpoint ${endpoint}:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
}
