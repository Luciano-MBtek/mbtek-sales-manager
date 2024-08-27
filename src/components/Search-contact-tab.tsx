"use client";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchContact } from "@/actions/searchContact";
import ContactCard from "./ContactCard";
import NoContactCard from "./NoContactCard";
import { searchContacts } from "@/actions/searchContactsByName";
import { ContactList } from "./ContactList";

export function SearchContactTab() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contacts, setContacts] = useState(null);
  const [selectedTab, setSelectedTab] = useState("email");
  const [contact, setContact] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);
    setContacts(null);
    const searchValue = selectedTab === "email" ? email : phone;
    const propertyType = selectedTab === "email" ? "email" : "phone";
    startTransition(async () => {
      try {
        const result = await searchContact(searchValue, propertyType);
        setContact(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    });
  };

  const handleContactsSearch = () => {
    setError(null);
    setContact(null);
    startTransition(async () => {
      try {
        if (firstname && lastname) {
          const result = await searchContacts(firstname, lastname);
          setContacts(result);
        } else if (firstname) {
          const result = await searchContacts(firstname);
          setContacts(result);
        } else if (lastname) {
          const result = await searchContacts(firstname, lastname);
          setContacts(result);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    });
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    searchFunction: () => void
  ) => {
    if (e.key === "Enter") {
      searchFunction();
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "");
    setPhone(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        defaultValue="email"
        className="w-[1000px]"
        onValueChange={(value) => setSelectedTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Card>
            <div className="flex items-center justify-between">
              <div className="w-[60%]">
                <CardHeader>
                  <CardTitle>Search by email</CardTitle>
                  <CardDescription>
                    Search contact from Hubspot by email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button onClick={handleSearch} disabled={isPending || !email}>
                    {isPending ? "Searching..." : "Search"}
                  </Button>
                </CardFooter>
              </div>
              <div className="p-2">
                {contact === 0 ? (
                  <NoContactCard
                    value={selectedTab === "email" ? "email" : "phone"}
                  />
                ) : (
                  contact && <ContactCard contact={contact} />
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="name">
          <Card>
            <CardHeader>
              <CardTitle>Search by name</CardTitle>
              <CardDescription>
                Search contact from Hubspot by name , lastname ,or fullname.
                <br></br> Can return a list of possible matchs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex w-full items-center space-y-2 gap-10">
              <div className="space-y-1">
                <Label htmlFor="name">Firstname</Label>
                <Input
                  id="name"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleContactsSearch)}
                  className="w-[250px]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastname">Lastname</Label>
                <Input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleContactsSearch)}
                  className="w-[250px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleContactsSearch}
                disabled={isPending || (!firstname && !lastname)}
              >
                {isPending ? "Searching..." : "Search"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="phone">
          <Card>
            <div className="flex items-center justify-between">
              <div className="w-[60%]">
                <CardHeader>
                  <CardTitle>Search by phone</CardTitle>
                  <CardDescription>
                    Search contact from Hubspot by phone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSearch} disabled={isPending || !phone}>
                    {isPending ? "Searching..." : "Search"}
                  </Button>
                </CardFooter>
              </div>
              <div className="p-2">
                {contact === 0 ? (
                  <NoContactCard
                    value={selectedTab === "email" ? "email" : "phone"}
                  />
                ) : (
                  contact && <ContactCard contact={contact} />
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {contacts === 0 ? (
        <NoContactCard value={"name"} />
      ) : (
        contacts && <ContactList contacts={contacts} />
      )}
    </div>
  );
}
