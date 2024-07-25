import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { TripLinkProps } from "@/components/TripLink";
import { linksServer } from "@/server/links-server";
import { colors } from "@/styles/colors";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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

      console.log(links);
      setLinks(links);
    } catch (error) {
      console.log(error);
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

        <Button isLoading={isCreatingLinkTrip} onPress={() => {}}>
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
