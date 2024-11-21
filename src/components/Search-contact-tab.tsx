"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import ContactCard from "./ContactCard";
import NoContactCard from "./NoContactCard";
import { ContactList } from "./ContactList";
import { useContactSearch } from "@/hooks/useContactSearch";
import { useSingleProductContext } from "@/contexts/singleProductContext";

export function SearchContactTab() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [selectedTab, setSelectedTab] = useState("email");
  const { resetLocalStorage } = useSingleProductContext();
  const {
    contact,
    contacts,
    isPending,
    error,
    handleSearch,
    handleContactsSearch,
  } = useContactSearch();

  useEffect(() => {
    resetLocalStorage();
  }, [resetLocalStorage]);

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
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleSearch(email, "email"))
                      }
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleSearch(email, "email")}
                    disabled={isPending || !email}
                  >
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
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleContactsSearch(firstname, lastname)
                    )
                  }
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
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      handleContactsSearch(firstname, lastname)
                    )
                  }
                  className="w-[250px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleContactsSearch(firstname, lastname)}
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
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => handleSearch(phone, "phone"))
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSearch(phone, "phone")}
                    disabled={isPending || !phone}
                  >
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
