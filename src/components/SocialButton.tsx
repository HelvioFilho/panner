import React from "react";
import { Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type SocialButtonProps = {
  platform: "facebook" | "apple" | "google";
  onPress?: () => void;
};

const platformConfig = {
  facebook: {
    icon: <FontAwesome name="facebook" size={24} color="white" />,
    color: "bg-blue-600",
    text: "Entrar com o Facebook",
  },
  apple: {
    icon: <FontAwesome name="apple" size={24} color="white" />,
    color: "bg-gray-500",
    text: "Entrar com o Apple",
  },
  google: {
    icon: <FontAwesome name="google" size={24} color="white" />,
    color: "bg-green-500",
    text: "Entrar com o Google",
  },
};
export function SocialButton({ platform, onPress }: SocialButtonProps) {
  const config = platformConfig[platform];

  return (
    <Pressable
      className={`flex-row items-center px-6 py-3 rounded ${config.color} justify-start`}
      onPress={onPress}
    >
      {config.icon}
      <Text className="text-white ml-3 text-lg font-bold">{config.text}</Text>
    </Pressable>
  );
}
