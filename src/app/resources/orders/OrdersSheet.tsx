"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersSheet() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // safety net: hide skeleton after 6s even if onLoad never fires
    const t = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleLoad = () => {
    setLoading(false);
  };
  const handleError = () => {
    setLoading(false);
    console.error("Failed to load orders sheet");
  };

  return (
    <div className="h-[calc(100vh-12rem)] w-full rounded-2xl border bg-white overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 p-4 space-y-2 bg-white">
          <Skeleton className="h-8 w-48 mb-4" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      )}

      <iframe
        src={process.env.NEXT_PUBLIC_ORDERS_SHEET_URL}
        className="h-full w-full"
        loading="eager"
        sandbox="allow-same-origin allow-scripts"
        referrerPolicy="no-referrer"
        allowFullScreen
        title="Orders Sheet"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
