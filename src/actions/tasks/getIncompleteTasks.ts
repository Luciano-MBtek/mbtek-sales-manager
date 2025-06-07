"use server";

import { getHubspotOwnerIdSession } from "../user/getHubspotOwnerId";
import { Task } from "@/types/Tasks";

const API = "https://api.hubapi.com";

const hubFetch = (url: string, init: RequestInit = {}, revalidate = 60) =>
  fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    next: { revalidate },
  });

const taskProperties = ["hs_task_subject", "hs_task_status"];

export async function getIncompleteTasks(): Promise<Task[]> {
  if (!process.env.HUBSPOT_API_KEY) throw new Error("Missing HUBSPOT_API_KEY");

  const ownerId = await getHubspotOwnerIdSession();

  const searchBody = {
    properties: taskProperties,
    filterGroups: [
      {
        filters: [
          { propertyName: "hubspot_owner_id", operator: "EQ", value: ownerId },
          { propertyName: "hs_task_is_completed", operator: "EQ", value: "false" },
        ],
      },
    ],
    sorts: ["-hs_createdate"],
    limit: 100,
  };

  const res = await hubFetch(`${API}/crm/v3/objects/tasks/search`, {
    method: "POST",
    body: JSON.stringify(searchBody),
  });

  if (!res.ok) throw new Error("Failed to fetch tasks: " + res.statusText);

  const json = await res.json();
  return json.results as Task[];
}
