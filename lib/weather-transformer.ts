
import { WeatherApiData } from "./weather-api";
import type { UserRoutines } from "./user-profile";

export type MausamWeatherData = {
  location: string;

  current: {
    temperature: number;
    humidity: number;
    feelsLike: number;
    windSpeed: number;
    rainChance: number;
    condition: string;
  };

  tomorrowMorning: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainChance: number;
    condition: string;
  };

  commute: {
    rainChance: number;
    windSpeed: number;
    condition: string;
    visibility: string;
  };
};

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear Sky";

  if (code === 1 || code === 2) {
    return "Partly Cloudy";
  }

  if (code === 3) return "Overcast";

  if (code === 45 || code === 48) {
    return "Foggy";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "Rainy";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snowy";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain Showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Unknown";
}

function getVisibilityStatus(
  visibility: number
): string {
  if (visibility < 1000) return "Poor";

  if (visibility < 5000) return "Moderate";

  return "Good";
}

// Get the current date and time in Bengaluru's timezone.
function getIndiaDateTime() {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }
  ).formatToParts(new Date());

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const date = `${getPart("year")}-${getPart(
    "month"
  )}-${getPart("day")}`;

  const time = `${getPart("hour")}:${getPart(
    "minute"
  )}`;

  return { date, time };
}

// Add one calendar day without relying on the
// computer/server's local timezone.
function addOneDay(date: string): string {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  const nextDate = new Date(
    Date.UTC(year, month - 1, day + 1)
  );

  return [
    nextDate.getUTCFullYear(),
    String(nextDate.getUTCMonth() + 1).padStart(
      2,
      "0"
    ),
    String(nextDate.getUTCDate()).padStart(
      2,
      "0"
    ),
  ].join("-");
}

// Convert HH:mm to minutes after midnight.
function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

// Find the closest available hourly forecast
// on the requested date.
function findForecastIndex(
  times: string[],
  targetDate: string,
  targetTime: string
): number {
  const targetMinutes = timeToMinutes(targetTime);

  let closestIndex = -1;
  let smallestDifference = Infinity;

  times.forEach((forecastTime, index) => {
    const [forecastDate, forecastClock] =
      forecastTime.split("T");

    // Only compare forecast hours on the target date.
    if (
      forecastDate !== targetDate ||
      !forecastClock
    ) {
      return;
    }

    const forecastMinutes = timeToMinutes(
      forecastClock.slice(0, 5)
    );

    const difference = Math.abs(
      forecastMinutes - targetMinutes
    );

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = index;
    }
  });

  return closestIndex;
}

// Fallback: find the first available forecast
// if the requested date is outside API coverage.
function findFallbackIndex(
  times: string[],
  targetDate: string,
  targetTime: string
): number {
  const target = `${targetDate}T${targetTime}`;

  const index = times.findIndex(
    (time) => time >= target
  );

  if (index !== -1) return index;

  return times.length - 1;
}

export function transformWeatherData(
  data: WeatherApiData,
  location: string,
  routines: UserRoutines = {}
): MausamWeatherData {
  const { date: today, time: currentTime } =
    getIndiaDateTime();

  const tomorrow = addOneDay(today);

  // Use the user's configured routine.
  // Defaults preserve the existing demo behaviour.
  const runningTime =
    routines.runningTime ?? "06:00";

  const commuteTime =
    routines.commuteTime ?? "09:00";

  const times = data.hourly.time;

  // Running is planned for tomorrow.
  const runningIndex = findForecastIndex(
    times,
    tomorrow,
    runningTime
  );

  // Use today's commute time if it is still ahead.
  // Otherwise, use the next day's commute time.
  const commuteDate =
    currentTime < commuteTime
      ? today
      : tomorrow;

  const commuteIndex = findForecastIndex(
    times,
    commuteDate,
    commuteTime
  );

  // Find the closest available current hour.
  const currentIndex = findForecastIndex(
    times,
    today,
    currentTime
  );

  const safeCurrentIndex =
    currentIndex !== -1
      ? currentIndex
      : findFallbackIndex(
          times,
          today,
          currentTime
        );

  // Fallbacks prevent missing forecast hours
  // from producing an invalid array index.
  const safeRunningIndex =
    runningIndex !== -1
      ? runningIndex
      : findFallbackIndex(
          times,
          tomorrow,
          runningTime
        );

  const safeCommuteIndex =
    commuteIndex !== -1
      ? commuteIndex
      : findFallbackIndex(
          times,
          commuteDate,
          commuteTime
        );

  return {
    location,

    current: {
      temperature: Math.round(
        data.current.temperature_2m
      ),

      humidity: Math.round(
        data.current.relative_humidity_2m
      ),

      feelsLike: Math.round(
        data.current.apparent_temperature
      ),

      windSpeed: Math.round(
        data.current.wind_speed_10m
      ),

      rainChance:
        data.hourly.precipitation_probability[
          safeCurrentIndex
        ] ?? 0,

      condition: getWeatherCondition(
        data.current.weather_code
      ),
    },

    tomorrowMorning: {
      temperature: Math.round(
        data.hourly.temperature_2m[
          safeRunningIndex
        ] ?? 0
      ),

      humidity: Math.round(
        data.hourly.relative_humidity_2m[
          safeRunningIndex
        ] ?? 0
      ),

      windSpeed: Math.round(
        data.hourly.wind_speed_10m[
          safeRunningIndex
        ] ?? 0
      ),

      rainChance:
        data.hourly.precipitation_probability[
          safeRunningIndex
        ] ?? 0,

      condition: getWeatherCondition(
        data.hourly.weather_code[
          safeRunningIndex
        ] ?? -1
      ),
    },

    commute: {
      rainChance:
        data.hourly.precipitation_probability[
          safeCommuteIndex
        ] ?? 0,

      windSpeed: Math.round(
        data.hourly.wind_speed_10m[
          safeCommuteIndex
        ] ?? 0
      ),

      condition: getWeatherCondition(
        data.hourly.weather_code[
          safeCommuteIndex
        ] ?? -1
      ),

      visibility: getVisibilityStatus(
        data.hourly.visibility[
          safeCommuteIndex
        ] ?? 10000
      ),
    },
  };
}