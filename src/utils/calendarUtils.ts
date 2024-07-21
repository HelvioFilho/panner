import dayjs, { Dayjs } from "dayjs";
import { DateData, CalendarUtils } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

type OrderStartsAtAndEndsAt = {
  startsAt?: DateData;
  endsAt?: DateData;
  selectedDay: DateData;
};

type FormatDatesInText = {
  startsAt: Dayjs;
  endsAt: Dayjs;
};

export type DatesSelected = {
  startsAt: DateData | undefined;
  endsAt: DateData | undefined;
  dates: MarkedDates;
  formatDatesInText: string;
};

function orderStartsAtAndEndsAt({
  startsAt,
  endsAt,
  selectedDay,
}: OrderStartsAtAndEndsAt): DatesSelected {
  if (!startsAt) {
    return {
      startsAt: selectedDay,
      endsAt: undefined,
      formatDatesInText: "",
      dates: getIntervalDates(selectedDay, selectedDay),
    };
  }

  if (startsAt && endsAt) {
    return {
      startsAt: selectedDay,
      endsAt: undefined,
      formatDatesInText: "",
      dates: getIntervalDates(selectedDay, selectedDay),
    };
  }

  if (selectedDay.timestamp <= startsAt.timestamp) {
    return {
      startsAt: selectedDay,
      endsAt: startsAt,
      dates: getIntervalDates(selectedDay, startsAt),
      formatDatesInText: formatDatesInText({
        startsAt: dayjs(selectedDay.dateString),
        endsAt: dayjs(startsAt.dateString),
      }),
    };
  }

  return {
    startsAt: startsAt,
    endsAt: selectedDay,
    dates: getIntervalDates(startsAt, selectedDay),
    formatDatesInText: formatDatesInText({
      startsAt: dayjs(startsAt.dateString),
      endsAt: dayjs(selectedDay.dateString),
    }),
  };
}

function formatDatesInText({ startsAt, endsAt }: FormatDatesInText) {
  const startMonth = startsAt.format("MMMM");
  const endMonth = endsAt.format("MMMM");
  const startDate = startsAt.date();
  const endDate = endsAt.date();

  let formatted;

  if (startMonth === endMonth) {
    formatted = `${startDate} à ${endDate} de ${startMonth}`;
  } else {
    formatted = `${startDate} de ${startMonth} à ${endDate} de ${endMonth}`;
  }

  return formatted;
}

function getIntervalDates(startsAt: DateData, endsAt: DateData): MarkedDates {
  const start = dayjs(startsAt.dateString);
  const end = dayjs(endsAt.dateString);

  let currentDate = start;
  const datesArray: string[] = [];

  while (currentDate.isBefore(end) || currentDate.isSame(end)) {
    datesArray.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }

  let interval: MarkedDates = {};

  datesArray.forEach((date) => {
    interval = {
      ...interval,
      [date]: {
        selected: true,
      },
    };
  });

  return interval;
}

export const calendarUtils = {
  orderStartsAtAndEndsAt,
  formatDatesInText,
  dateToCalendarDate: CalendarUtils.getCalendarDateString,
};
