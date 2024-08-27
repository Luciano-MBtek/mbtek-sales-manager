import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contact } from "../../types";
import { Button } from "./ui/button";
import Link from "next/link";

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
  console.log(contacts);

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
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">
              {contact.properties.firstname} {contact.properties.lastname}
            </TableCell>
            <TableCell>{contact.properties.email}</TableCell>
            <TableCell>{contact.properties.phone}</TableCell>
            <TableCell className="text-right">
              <Link href={`/contacts/${contact.id}`}>
                <Button>Details</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
