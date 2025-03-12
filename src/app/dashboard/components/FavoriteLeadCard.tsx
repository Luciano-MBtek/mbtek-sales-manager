"use client";
import { Button } from "@/components/ui/button";
import { Star, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { UserWithRelations } from "../user-dashboard";
import { removeContactFromFav } from "@/actions/contact/removeContactFromFav";
import { toast } from "@/components/ui/use-toast";

const FavoriteLeadCard = ({ user }: { user: UserWithRelations }) => {
  const router = useRouter();

  const removeLeadfromFav = (id: string) => {
    startTransition(() => {
      removeContactFromFav(id)
        .then(() => {
          toast({
            title: `Removed from Favorites`,
            description: (
              <div className="flex gap-2">
                <p className="text-primary">
                  {user.name} removed from Favorites
                </p>
                <Star width={20} />
              </div>
            ),
          });
        })
        .catch((error) => {
          toast({
            title: "Error removing from Favorites",
            description: <p className="text-destructive">{error.message}</p>,
            variant: "destructive",
          });
        });
    });
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Favorite Leads</CardTitle>
          <Star size={20} className="fill-current text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {user.favoriteLeads.map(({ lead }) => (
            <li
              key={lead.id.toString()}
              className="flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span>{lead.name}</span>
                <span className="text-gray-500">{lead.email}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/contacts/${lead.hubspotId}`)}
                >
                  Open
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => removeLeadfromFav(lead.hubspotId)}
                >
                  <Trash
                    className="opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FavoriteLeadCard;
