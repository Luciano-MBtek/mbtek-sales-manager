import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { MoreHorizontal, Copy } from "lucide-react";
import { DialogCloseButton } from "./DialogAction";
import { useToast } from "@/components/ui/use-toast";

const DropDownTable = ({
  property,
  value,
  friendlyName,
}: {
  property: string;
  value: string;
  friendlyName: string;
}) => {
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    const truncatedText = text.length > 20 ? `${text.slice(0, 20)}...` : text;
    toast({
      title: `Copied ${truncatedText} to clipboard`,
    });
  };

  return (
    <Dialog>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleCopy(property)}
            className="flex justify-between gap-2"
          >
            <span>Hubspot property</span>
            <Copy className="w-4 h-4 mr-2" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleCopy(value)}
            className="flex justify-between gap-2"
          >
            <span>Value</span>
            <Copy className="w-4 h-4 mr-2" />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="w-full" />
          <DialogTrigger asChild>
            <DropdownMenuItem>Modify property</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
        <DialogCloseButton
          property={property}
          friendlyName={friendlyName}
          onDialogClose={() => setDropdownOpen(false)}
        />
      </DropdownMenu>
    </Dialog>
  );
};

export default DropDownTable;
