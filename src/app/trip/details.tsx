import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Plus } from "lucide-react-native";

import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { TripLink, TripLinkProps } from "@/components/TripLink";

import { colors } from "@/styles/colors";
import { linksServer } from "@/server/links-server";
import { validateInput } from "@/utils/validateInput";

export function Details({ tripId }: { tripId: string }) {
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);

  const [links, setLinks] = useState<TripLinkProps[]>([]);

  const [linkTitle, setLinkTitle] = useState("");
  const [linkURL, setLinkURL] = useState("");

  function resetNewLinkFields() {
    setLinkTitle("");
    setLinkURL("");
    setShowNewLinkModal(false);
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId);

      setLinks(links);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCreateTripLink() {
    try {
      if (!linkTitle.trim()) {
        return Alert.alert("Link", "Informe um título para o link.");
      }

      if (!validateInput.url(linkURL.trim())) {
        return Alert.alert("Link", "Link inválido!");
      }

      setIsCreatingLinkTrip(true);

      await linksServer.create({
        tripId,
        title: linkTitle,
        url: linkURL,
      });

      Alert.alert("Link", "Link criado com sucesso!");
      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

  useEffect(() => {
    getTripLinks();
  }, []);

  return (
    <View className="flex-1 mt-10">
      <Text className="text-zinc-50 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1">
        {links.length > 0 ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link adicionado.
          </Text>
        )}
        <Button variant="secondary" onPress={() => setShowNewLinkModal(true)}>
          <Plus color={colors.zinc[200]} size={20} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes."
        visible={showNewLinkModal}
        onClose={() => setShowNewLinkModal(false)}
      >
        <View className="gap-2 mb-3">
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link"
              onChangeText={setLinkTitle}
            />
          </Input>

          <Input variant="secondary">
            <Input.Field placeholder="URL" onChangeText={setLinkURL} />
          </Input>
        </View>

        <Button isLoading={isCreatingLinkTrip} onPress={handleCreateTripLink}>
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
