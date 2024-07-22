import { SectionList, Text, View } from "react-native";
import { TripData } from "./[id]";
import { Button } from "@/components/Button";
import { PlusIcon } from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Activity, ActivityProps } from "@/components/Activity";
import { useState } from "react";
import { Loading } from "@/components/Loading";

type ActivitiesProps = {
  tripDetails: TripData;
};

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

type TripActivities = {
  title: {
    dayNumber: number;
    dayName: string;
  };
  data: ActivityProps[];
};

export function Activities({ tripDetails }: ActivitiesProps) {
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const [tripActivities, setTripActivities] = useState<TripActivities[]>([]);

  async function getTripActivities() {}

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="flex-1 text-zinc-50 text-2xl font-semibold">
          Atividades
        </Text>
        <Button onPress={() => {}}>
          <Button.Title>Nova Atividade</Button.Title>
          <PlusIcon color={colors.lime[950]} />
        </Button>
      </View>

      {isLoadingActivities ? (
        <Loading />
      ) : (
        <SectionList
          sections={tripActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Activity data={item} />}
          renderSectionHeader={({ section }) => (
            <View className="w-full">
              <Text className="text-zinc-50 text-2xl font-semibold py-2">
                Dia {section.title.dayNumber + " "}
                <Text className="text-zinc-500 text-base font-regular capitalize">
                  {section.title.dayName}
                </Text>
              </Text>

              {section.data.length === 0 && (
                <Text className="text-zinc-500 font-regular text-sm mb-8">
                  Nenhuma atividade cadastrada nessa data.
                </Text>
              )}
            </View>
          )}
          contentContainerClassName="gap-3 pb-48"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
