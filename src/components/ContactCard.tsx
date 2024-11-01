"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Contact } from "@/types";
import { Button } from "./ui/button";
import Link from "next/link";

const ContactCard = ({ contact }: { contact: Contact }) => {
  const { firstname, lastname, email, phone, hs_object_id } =
    contact.properties || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Found:</CardTitle>
        <CardDescription>Details of the contact</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Name: {firstname || "N/A"} {lastname || "N/A"}
        </p>
        <p>Email: {email || "N/A"}</p>
        <p>Phone: {phone || "N/A"}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/contacts/${hs_object_id}`}>
          <Button>Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ContactCard;
