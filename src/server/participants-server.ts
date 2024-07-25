import { api } from "./api";

export type Participant = {
  id: string;
  name: string;
  email: string;
  is_confirmed: string;
};

async function getByTripId(tripId: string) {
  try {
    const { data } = await api.get<{ participants: Participant[] }>(
      `/trips/${tripId}/participants`
    );

    return data.participants;
  } catch (error) {
    throw error;
  }
}

export const participantsServer = { getByTripId };
