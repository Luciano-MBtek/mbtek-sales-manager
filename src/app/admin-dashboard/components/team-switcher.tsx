"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { PopoverTriggerProps } from "@radix-ui/react-popover";
import { useState } from "react";
import CreateUserForm from "./createUserForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { User } from "@prisma/client";

// Update TeamSwitcherProps to include users
interface TeamSwitcherProps extends PopoverTriggerProps {
  users: User[];
}

// Remove the static groups const and create a function to transform users data
function transformUsersToGroups(users: User[]) {
  const groupedUsers = users.reduce(
    (acc, user) => {
      // Usar una clave normalizada para la comparación
      const normalizedAccessLevel = user.accessLevel.toLowerCase() + "s";
      const group = acc.find((g) => g.normalizedKey === normalizedAccessLevel);

      if (group) {
        group.teams.push({
          label: user.name,
          value: user.id.toString(),
          email: user.email,
          hubspotId: user.hubspotId || undefined,
        });
      } else {
        acc.push({
          label:
            user.accessLevel.replace(/_/g, " ").charAt(0).toUpperCase() +
            user.accessLevel.replace(/_/g, " ").slice(1) +
            "s",
          normalizedKey: normalizedAccessLevel,
          teams: [
            {
              label: user.name,
              value: user.id.toString(),
              email: user.email,
              hubspotId: user.hubspotId || undefined,
            },
          ],
        });
      }
      return acc;
    },
    [] as {
      label: string;
      normalizedKey: string;
      teams: {
        label: string;
        value: string;
        email: string;
        hubspotId?: string;
      }[];
    }[]
  );

  return groupedUsers;
}

export default function TeamSwitcher({ users }: TeamSwitcherProps) {
  const groups = transformUsersToGroups(users);
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({
    label: "Select a user",
    value: "all",
    email: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateHubspotIdParam = (hubspotId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (hubspotId) {
      params.set("hubspotId", hubspotId);
    } else {
      params.delete("hubspotId");
    }
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between")}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                alt={selectedTeam.label}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <ChevronsUpDown className="ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search team..." />
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="">
                <CommandItem
                  onSelect={() => {
                    setSelectedTeam({
                      label: "Select a user",
                      value: "all",
                      email: "",
                    });
                    setOpen(false);
                    updateHubspotIdParam(null);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/all.png`}
                      alt="All Users"
                      className="grayscale"
                    />
                    <AvatarFallback>ALL</AvatarFallback>
                  </Avatar>
                  You
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedTeam.value === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              </CommandGroup>
              {groups.map((group, index) => (
                <CommandGroup
                  key={`${group.label}-${index}`}
                  heading={group.label}
                >
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                        updateHubspotIdParam(team.hubspotId || null);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create User
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateUserForm setShowNewTeamDialog={setShowNewTeamDialog} />
    </Dialog>
  );
}
