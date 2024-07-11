import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});
