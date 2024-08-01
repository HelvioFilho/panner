import * as SecureStore from "expo-secure-store";

async function getToken(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    throw error;
  }
}

async function saveToken(key: string, value: string) {
  try {
    return await SecureStore.setItemAsync(key, value);
  } catch (error) {
    throw error;
  }
}

export const tokenStorage = { getToken, saveToken };
