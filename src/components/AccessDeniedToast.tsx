"use client";

import { Suspense, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";

function AccessDeniedHandler() {
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

export function AccessDeniedToast() {
  return (
    <Suspense fallback={null}>
      <AccessDeniedHandler />
    </Suspense>
  );
}
