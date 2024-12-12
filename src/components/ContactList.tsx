import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from "../types";
import { Button } from "./ui/button";
import Link from "next/link";

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
  return (
    <Table>
      <TableCaption className="p-4 text-green-500">
        These contacts were found.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          const { firstname, lastname, email, phone } = contact.properties;

          return (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {firstname} {lastname}
              </TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{phone}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/contacts/${contact.id}?name=${firstname}&lastname=${lastname}`}
                >
                  <Button>Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
