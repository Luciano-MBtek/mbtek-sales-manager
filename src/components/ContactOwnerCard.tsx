import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail } from "lucide-react";

interface Owner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const ContactOwnerCard = ({ owner }: { owner: Owner | null }) => {
  console.log(owner);
  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">
          {owner?.id ? "Contact Owner" : "Contact without Owner"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {owner?.id ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${owner.firstName}%20${owner.lastName}`}
                alt={`${owner.firstName} ${owner.lastName}`}
              />
              <AvatarFallback>
                {owner.firstName[0]}
                {owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {owner.firstName} {owner.lastName}
              </h3>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {owner.email}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                Owner ID: {owner.id}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4 text-muted-foreground">
            <User className="h-8 w-8" />
            <p>This contact does not have an assigned owner.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactOwnerCard;
