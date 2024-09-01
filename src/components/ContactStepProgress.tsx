import { ProgressProperties } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UsaFlag from "./utils/UsaFlag";
import CanadaFlag from "./utils/CanadaFlag";

const ContactStepProgress = ({
  properties,
}: {
  properties: ProgressProperties;
}) => {
  const fullName = `${properties.firstname} ${properties.lastname}`;
  const progressPercentage =
    ((properties.totalProperties - properties.emptyProperties) /
      properties.totalProperties) *
    100;

  const formattedDate = new Date(properties.createDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">{fullName}</p>
            <p className="text-sm text-muted-foreground">
              Lead Status: {properties.leadStatus}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <MapPin className="w-6 h-6 text-primary" />
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{properties.country_us_ca}</span>
            {properties.country_us_ca === "USA" ? (
              <UsaFlag />
            ) : properties.country_us_ca === "Canada" ? (
              <CanadaFlag />
            ) : (
              <p>-</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">Data Collection</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {properties.totalProperties - properties.emptyProperties} /{" "}
              {properties.totalProperties}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-gray-200"
            gradientColor={true}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Created</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactStepProgress;
