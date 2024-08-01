import "@/styles/global.css";
import "@/utils/dayjsLocaleConfig";

import { useEffect } from "react";
import { router, Slot } from "expo-router";
import { StatusBar, View } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import {
  useFonts,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import { Loading } from "@/components/Loading";
import { tokenStorage } from "@/storage/token";

const PUBLIC_CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/trip");
      }
    } else {
      return;
    }
  }, [isSignedIn]);

  return isLoaded ? <Slot /> : <Loading />;
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ClerkProvider
        publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenStorage}
      >
        <InitialLayout />
      </ClerkProvider>
    </View>
  );
}
