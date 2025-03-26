const accessToken = process.env.HUBSPOT_API_KEY;

type Team = {
  id: string;
  name: string;
  primary: boolean;
};

type Owner = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  teams: Team[];
  type: string;
  userId?: number;
  userIdIncludingInactive?: number;
};

export type OwnersArray = Owner[];

export async function getAllOwners(): Promise<
  | {
      message: string;
      quantity: number;
      data: OwnersArray;
    }
  | {
      error: string;
    }
> {
  try {
    const url = "https://api.hubapi.com/crm/v3/owners";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        message: "All owners have been retrieved",
        quantity: data.results.length,
        data: data.results,
      };
    } else {
      const errorData = await response.json();
      console.error("Error retrieving owners:", errorData);
      return {
        error: errorData.message || "Error retrieving the owners",
      };
    }
  } catch (error) {
    console.error("Error in the request:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
