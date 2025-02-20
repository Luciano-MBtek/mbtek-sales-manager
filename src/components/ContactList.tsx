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
  searchValue: string;
};

export function ContactList({ contacts, searchValue }: ContactListProps) {
  const getFilteredContacts = () => {
    if (searchValue.includes(" ") && contacts.length > 0) {
      const [firstName, lastName] = searchValue.split(" ");
      const partialMatches = contacts.filter(
        (contact: any) =>
          contact.properties.firstname
            ?.toLowerCase()
            .includes(firstName.toLowerCase()) &&
          contact.properties.lastname
            ?.toLowerCase()
            .includes(lastName.toLowerCase())
      );
      return partialMatches.length > 0 ? partialMatches : null;
    }
    return contacts;
  };
  const filteredContacts = getFilteredContacts();

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
        {(filteredContacts ?? []).map((contact) => {
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
