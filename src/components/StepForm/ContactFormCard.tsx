import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MailIcon, UserIcon } from "lucide-react";
import InfoItem from "@/components/InfoItem";

type ContactFormProps = {
  title: string;
  name: string;
  lastname: string;
  email: string;
};

const ContactFormCard = ({
  title,
  name,
  lastname,
  email,
}: ContactFormProps) => {
  return (
    <>
      <Card className="shadow-lg w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full">
          <div className="flex w-full justify-around gap-2">
            <InfoItem
              icon={<UserIcon className="h-5 w-5" />}
              label="Name"
              value={`${name} ${lastname}`}
            />
            <InfoItem
              icon={<MailIcon className="h-5 w-5" />}
              label="Email"
              value={email}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ContactFormCard;
