import { useQuery } from "@tanstack/react-query";
import { getMeetingsLink } from "@/actions/hubspot/meetings/getMeetingsLink";
import { getAllOwners } from "@/actions/getAllOwners";

/**
 * Hook to obtain the meeting link from the owner's ID
 * @param ownerId - ID of the lead's owner
 * @returns Object with link data, loading states, and error
 */
export const useMeetingLink = (ownerId: string | undefined) => {
  // 1. Get all owners
  const {
    data: ownersData,
    isLoading: isOwnersLoading,
    refetch: refetchOwners,
  } = useQuery({
    queryKey: ["allOwners"],
    queryFn: async () => {
      const allOwners = await getAllOwners();
      return allOwners;
    },
  });

  // 2. Find the specific owner and their userId
  const leadOwner =
    ownersData && "data" in ownersData
      ? ownersData.data.find((owner) => owner.id === ownerId)
      : undefined;

  const ownerUserId = leadOwner?.userId;

  // 3. Get the meeting link using the userId
  const {
    data: meetingLinkData,
    isLoading: isMeetingLinkLoading,
    refetch: refetchMeetingLink,
  } = useQuery({
    queryKey: ["meetingLink", ownerUserId],
    queryFn: async () => {
      if (!ownerUserId) return null;
      return getMeetingsLink(ownerUserId);
    },
    enabled: !!ownerUserId,
  });

  const meetingLink = meetingLinkData?.results?.[0];

  const refetchAll = async () => {
    await refetchOwners();
    if (ownerUserId) {
      await refetchMeetingLink();
    }
  };

  return {
    meetingLink,
    isLoading: isOwnersLoading || isMeetingLinkLoading,
    leadOwner,
    refetchAll,
  };
};
