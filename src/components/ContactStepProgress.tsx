"use client";
import { ProgressProperties } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  Calendar,
  BarChart2,
  Mail,
  Home,
  PencilRuler,
  CircleCheck,
  Quote,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import UsaFlag from "./utils/UsaFlag";
import CanadaFlag from "./utils/CanadaFlag";
import { useContactStore } from "@/store/contact-store";
import { useEffect } from "react";
import { Contact } from "@/store/contact-store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ContactQualificationCard from "./ContactQualificationCard";

const ContactStepProgress = ({
  properties,
}: {
  properties: ProgressProperties;
}) => {
  const { contact, update } = useContactStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const session = useSession();

  const accessLevel = session.data?.user.accessLevel;
  const allowRequest = accessLevel !== "schematic_team";
  const redirect = searchParams.get("redirect");

  const {
    id,
    firstname,
    lastname,
    email,
    phone,
    totalProperties,
    emptyProperties,
    createDate,
    leadStatus,
    country_us_ca,
    state,
    province,
    city,
    zip,
    address,
    areDeals,
    hasSchematic,
    hasQuotes,
  } = properties;

  const fullName = `${firstname} ${lastname}`;
  const progressPercentage =
    ((totalProperties - emptyProperties) / totalProperties) * 100;

  const formattedDate = new Date(createDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const initialContactData = {
      id,
      firstname,
      lastname,
      leadStatus,
      email,
      country: country_us_ca,
      ...(country_us_ca === "USA"
        ? { state }
        : country_us_ca === "Canada"
          ? { province }
          : {}),
      city,
      zip,
      phone,
      address,
      areDeals,
      hasSchematic,
      hasQuotes,
    };

    // Filtrar los valores que son "N/A"
    const contactData = Object.entries(initialContactData).reduce(
      (acc, [key, value]) => {
        if (value !== "N/A" || key === "areDeals") {
          if (key === "areDeals") {
            acc[key as keyof Contact] = Boolean(value) as any;
          } else {
            acc[key as keyof Contact] = value as any;
          }
        }
        return acc;
      },
      {} as Partial<Contact>
    );

    update(contactData as Contact);
  }, [
    id,
    firstname,
    lastname,
    leadStatus,
    email,
    update,
    country_us_ca,
    state,
    province,
    city,
    zip,
    address,
    areDeals,
    hasSchematic,
    hasQuotes,
    phone,
  ]);

  useEffect(() => {
    // If contact is loaded and we have a redirect URL, navigate to it
    if (contact && redirect) {
      router.push(redirect);
    }
  }, [contact, redirect, router]);

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="col-span-2 flex items-center space-x-4">
            <User className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">{fullName}</p>
              <p className="text-sm text-muted-foreground">
                Lead Status: {leadStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-primary" />
            <p className="font-semibold">{email}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">Created</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-primary mt-1" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{country_us_ca}</span>
                {country_us_ca === "USA" ? (
                  <UsaFlag />
                ) : country_us_ca === "Canada" ? (
                  <CanadaFlag />
                ) : (
                  <p>-</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {country_us_ca === "USA"
                  ? state
                  : country_us_ca === "Canada"
                    ? province
                    : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Home className="w-6 h-6 text-primary mt-1" />
            <div>
              <p className="font-semibold">Shipping data:</p>
              <p className="text-sm text-muted-foreground">
                {city}, {zip}
              </p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                <span className="font-semibold">Data Collection</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {totalProperties - emptyProperties} / {totalProperties}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-gray-200"
              gradientColor={true}
            />
          </div>

          <div className="col-span-2">
            {hasSchematic ? (
              <div className="flex items-center space-x-4">
                <PencilRuler className="w-6 h-6 text-primary" />
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold">Schematic Requested</p>
                  <Badge className="bg-success">
                    <CircleCheck className="w-4 h-4 mr-1" />
                    Completed
                  </Badge>
                </div>
              </div>
            ) : allowRequest ? (
              <div className="flex items-center space-x-4">
                <PencilRuler className="w-6 h-6 text-primary" />
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold">Request Schematic</p>
                  <Button
                    onClick={() => router.push("/forms/schematic-request")}
                  >
                    Request
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>You are not a Sales Agent or Admin.</p>
                <p>Sales Agents can only ask for schematics</p>
              </div>
            )}
          </div>

          {hasQuotes && (
            <div className="col-span-2 flex items-center space-x-4">
              <Quote className="w-6 h-6 text-primary" />
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold">Quotes available</p>
                <Button onClick={() => router.push(`/contacts/${id}/quotes`)}>
                  Go to Quotes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ContactQualificationCard properties={properties} />
    </>
  );
};

export default ContactStepProgress;
