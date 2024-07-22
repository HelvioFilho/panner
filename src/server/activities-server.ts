import { api } from "./api";

type Activity = {
  id: string;
  occurs_at: string;
  title: string;
};

type ActivityCreate = Omit<Activity, "id"> & {
  tripId: string;
};

async function create({ tripId, occurs_at, title }: ActivityCreate) {
  try {
    const { data } = await api.post<{ activityId: string }>(
      `/trips/${tripId}/activities`,
      { occurs_at, title }
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export const activitiesServer = { create };
