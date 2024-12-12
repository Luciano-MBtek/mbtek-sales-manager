"use client";

import { Star } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { removeContactFromFav } from "@/actions/contact/removeContactFromFav";
import { addContactToFav } from "@/actions/contact/addContactToFav";
import { Contact } from "@/store/contact-store";
import { useTransition } from "react";
import { toast } from "./ui/use-toast";

interface SideBarAddToFavouriteProps {
  contact: Contact;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  isLoading: boolean;
}

const SideBarAddToFavourite = ({
  contact,
  isFavorite,
  setIsFavorite,
  isLoading,
}: SideBarAddToFavouriteProps) => {
  const { id, firstname, lastname, email } = contact;
  const [isPending, startTransition] = useTransition();

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        startTransition(() => {
          removeContactFromFav(id)
            .then(() => {
              toast({
                title: `Removed from Favorites`,
                description: (
                  <div className="flex gap-2">
                    <p className="text-primary">
                      {firstname + " " + lastname} removed from Favorites
                    </p>
                    <Star width={20} />
                  </div>
                ),
              });
            })
            .catch((error) => {
              toast({
                title: "Error removing from Favorites",
                description: (
                  <p className="text-destructive">{error.message}</p>
                ),
                variant: "destructive",
              });
            });
        });
        setIsFavorite(false);
      } else {
        startTransition(() => {
          addContactToFav({
            id,
            firstname,
            lastname,
            email,
          })
            .then(() => {
              toast({
                title: "Added to Favorites",
                description: (
                  <div className="flex gap-2">
                    <p className="text-primary">
                      {firstname + " " + lastname} added to Favorites
                    </p>
                    <Star width={20} className="fill-current text-yellow-500" />
                  </div>
                ),
              });
              setIsFavorite(true);
            })
            .catch((error) => {
              toast({
                title: "Error adding to Favorites",
                description: (
                  <p className="text-destructive">{error.message}</p>
                ),
                variant: "destructive",
              });
            });
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <DropdownMenuItem onClick={handleFavoriteToggle} disabled={isLoading}>
      <div className="flex w-full items-center justify-between gap-2">
        <span>
          {isLoading
            ? "Loading..."
            : isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
        </span>
        <Star
          width={15}
          className={`transition-colors ${
            isLoading
              ? "text-gray-400"
              : isFavorite
                ? "fill-current text-yellow-500"
                : ""
          }`}
        />
      </div>
    </DropdownMenuItem>
  );
};

export default SideBarAddToFavourite;
