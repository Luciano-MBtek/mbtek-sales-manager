"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
  url: string;
}

export const DownloadButton = ({ url }: DownloadButtonProps) => {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const pathname = new URL(url, window.location.origin).pathname;
      const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloaded(true);
    } catch (err: any) {
      toast({
        title: "Copied",
        variant: "destructive",
        description: (
          <div className="flex gap-2">
            <p className="text-primary">Error downloading image.</p>
          </div>
        ),
      });
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="disabled:opacity-100"
            onClick={handleDownload}
            aria-label={downloaded ? "Downloaded" : "Download file"}
            disabled={downloaded}
          >
            <div
              className={cn(
                "transition-all",
                downloaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <Check
                className="stroke-emerald-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                downloaded ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <Download size={16} strokeWidth={2} aria-hidden="true" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          Click to download
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
