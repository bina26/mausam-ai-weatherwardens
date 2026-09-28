const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

export type WeatherApiData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    wind_speed_10m: number;
    visibility: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    visibility: number[];
  };
};

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherApiData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "visibility",
    ].join(","),

    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "visibility",
    ].join(","),

    timezone: "auto",
    forecast_days: "3",
  });

  const response = await fetch(
    `${WEATHER_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch weather data"
    );
  }

  const data = await response.json();

  return data;
}