import dayjs from "dayjs";
import { Alert, Keyboard, SectionList, Text, View } from "react-native";
import { TripData } from "./[id]";
import { Button } from "@/components/Button";
import {
  PlusIcon,
  Tag,
  Calendar as IconCalendar,
  Clock,
} from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Activity, ActivityProps } from "@/components/Activity";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { Calendar } from "@/components/Calendar";
import { activitiesServer } from "@/server/activities-server";

type ActivitiesProps = {
  tripDetails: TripData;
};

type Activity = {
  id: string;
  title: string;
  occurs_at: string;
};

type DayActivity = {
  date: string;
  activities: Activity[] | { [key: string]: Activity };
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

  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityHour] = useState("");

  const [tripActivities, setTripActivities] = useState<TripActivities[]>([]);

  function resetNewActivityFields() {
    setActivityDate("");
    setActivityTitle("");
    setActivityHour("");
    setShowModal(MODAL.NONE);
  }

  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour) {
        return Alert.alert("Aviso", "Preencha todos os campos!");
      }

      setIsCreatingActivity(true);

      let [hours, minutes] = activityHour.split(":").map(Number);

      if (isNaN(minutes)) {
        minutes = 0;
      }

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

      const occursAt = dayjs(activityDate)
        .set("hour", Number(formattedHours))
        .set("minute", Number(formattedMinutes))
        .tz("America/Sao_Paulo", true)
        .toString();

      await activitiesServer.create({
        tripId: tripDetails.id,
        occurs_at: occursAt,
        title: activityTitle,
      });

      Alert.alert("Aviso", "Nova atividade cadastrada com sucesso!");

      await getTripActivities();
      resetNewActivityFields();
    } catch (error) {
      Alert.alert(
        "Aviso",
        "Algo deu errado e não foi possível criar uma nova atividade!"
      );
    } finally {
      setIsCreatingActivity(false);
    }
  }

  async function getTripActivities() {
    try {
      const activitiesResponse: DayActivity[] =
        await activitiesServer.getActivitiesByTripId(tripDetails.id);

      const activitiesToSectionList = activitiesResponse.map((dayActivity) => ({
        title: {
          dayNumber: dayjs(dayActivity.date).date(),
          dayName: dayjs(dayActivity.date).format("dddd"),
        },
        data: Array.isArray(dayActivity.activities)
          ? dayActivity.activities.map((activity) => ({
              id: activity.id,
              title: activity.title,
              hour: dayjs(activity.occurs_at).format("hh[:]mm[h]"),
              isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
            }))
          : Object.values(dayActivity.activities).map((activity: Activity) => ({
              id: activity.id,
              title: activity.title,
              hour: dayjs(activity.occurs_at).format("hh[:]mm[h]"),
              isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
            })),
      }));

      setTripActivities(activitiesToSectionList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingActivities(false);
    }
  }

  function handleTimeChange(text: string) {
    let formattedText = text.replace(/[^0-9]/g, "");

    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}:${formattedText.slice(
        2,
        4
      )}`;
    }

    if (formattedText.length === 5) {
      const [hours, minutes] = formattedText.split(":").map(Number);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return Alert.alert("Aviso", "Horário inválido!");
      }
    }
    setActivityHour(formattedText);
  }

  useEffect(() => {
    getTripActivities();
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="flex-1 text-zinc-50 text-2xl font-semibold">
          Atividades
        </Text>
        <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
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
      <Modal
        visible={showModal === MODAL.NEW_ACTIVITY}
        title="Cadastrar atividade"
        subtitle="Todos os convidados podem visualizar as atividades"
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="mt-4 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <IconCalendar color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                onChangeText={setActivityTitle}
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onPressIn={() => setShowModal(MODAL.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário?"
                onChangeText={handleTimeChange}
                value={activityHour}
                keyboardType="numeric"
                maxLength={5}
              />
            </Input>
          </View>
        </View>

        <Button
          onPress={handleCreateTripActivity}
          isLoading={isCreatingActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Selecione a data da atividade"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />

          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
