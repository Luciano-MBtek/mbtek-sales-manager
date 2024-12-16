"use client";

import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function AccessDeniedToast() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("access_denied")) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have permission to access this route.",
      });
    }
  }, [searchParams, toast]);

  return null;
}
