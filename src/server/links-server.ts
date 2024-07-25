import { api } from "./api";

export type Link = {
  id: string;
  title: string;
  url: string;
};

async function getLinksByTripId(tripId: string) {
  try {
    const { data } = await api.get<{ links: Link[] }>(`/trips/${tripId}/links`);
    return data.links;
  } catch (error) {
    throw error;
  }
}

export const linksServer = { getLinksByTripId };
