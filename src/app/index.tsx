import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { StartOAuthFlowReturnType, useOAuth } from "@clerk/clerk-expo";

import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { SocialButton } from "@/components/SocialButton";

import { colors } from "@/styles/colors";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const oauthGoogle = useOAuth({ strategy: "oauth_google" });
  const oauthApple = useOAuth({ strategy: "oauth_apple" });
  const oauthFacebook = useOAuth({ strategy: "oauth_facebook" });

  async function handleSocialLogin(type: string) {
    try {
      setIsLoading(true);
      const redirectUrl = Linking.createURL("/");
      let oAuthFlow = {} as StartOAuthFlowReturnType;
      switch (type) {
        case "google":
          oAuthFlow = await oauthGoogle.startOAuthFlow({ redirectUrl });
          break;
        case "apple":
          oAuthFlow = await oauthApple.startOAuthFlow({ redirectUrl });
          break;
        case "facebook":
          oAuthFlow = await oauthFacebook.startOAuthFlow({ redirectUrl });
          break;
      }

      if (oAuthFlow.authSessionResult?.type === "success") {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  });

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        source={require("@/assets/logo.png")}
        className="h-8"
        resizeMode="contain"
      />
      <Image source={require("@/assets/bg.png")} className="absolute" />
      <Text className="text-zinc-100 font-regular text-lg mt-3">
        O seu aplicativo de planejamento de viagem.
      </Text>
      {isLoading ? (
        <View className="items-center justify-center mt-6">
          <ActivityIndicator color={colors.lime[300]} />
          <Text className="text-zinc-100 font-regular text-lg mt-3">
            Conectando...
          </Text>
        </View>
      ) : (
        <View className="gap-3 mt-6">
          <SocialButton
            platform="google"
            onPress={() => handleSocialLogin("google")}
          />
          {Platform.OS === "ios" && (
            <SocialButton
              platform="apple"
              onPress={() => handleSocialLogin("apple")}
            />
          )}
          <SocialButton
            platform="facebook"
            onPress={() => handleSocialLogin("facebook")}
          />
        </View>
      )}
      <View className="mt-7">
        <Text className="text-zinc-500 font-regular text-center text-base">
          Ao planejar sua viagem pela plann.er você automaticamente concorda com
          nossos{" "}
          <Pressable onPress={() => setShowModal(true)}>
            <Text className="text-zinc-300 underline">
              termos de uso e políticas de privacidade.
            </Text>
          </Pressable>
        </Text>
      </View>
      <Modal
        title="Termos de Uso"
        subtitle="Por favor, leia atentamente os termos de uso."
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <ScrollView className="mt-4 px-4" showsVerticalScrollIndicator={false}>
          <Text className="text-zinc-50 text-lg font-semibold mb-2">
            1. Sobre o uso de e-mail e nome de usuário
          </Text>
          <Text className="text-base text-zinc-400">
            Informamos que o aplicativo utiliza o e-mail e nome do usuário
            unicamente para visualização e controle de cadastro de usuários.
            {"\n"}
            {"\n"}
            Nenhuma informação será utilizada para fins comerciais ou venda de
            dados de qualquer espécie.
          </Text>
          <Text className="text-zinc-50 text-lg font-semibold mt-4 mb-2">
            2. Sobre responsabilidade
          </Text>
          <Text className="text-base text-zinc-400">
            O aplicativo não se responsabiliza por atrasos na viagem ou nas
            atividades. {"\n"}
            {"\n"} O usuário está ciente de que o aplicativo apenas mostra as
            atividades e não é responsável por elas. {"\n"}
            {"\n"}Os links compartilhados são de inteira responsabilidade dos
            usuários que os compartilharam, deixando o aplicativo sem nenhuma
            responsabilidade sobre eles.
          </Text>
          <Text className="text-zinc-50 text-lg font-semibold mt-4 mb-2">
            3. Aceitação dos Termos
          </Text>
          <Text className="text-base text-zinc-400">
            Ao utilizar o aplicativo, o usuário concorda com todos os termos
            acima.
          </Text>
        </ScrollView>
        <Button onPress={() => setShowModal(false)} className="mt-7">
          <Button.Title>Fechar</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
