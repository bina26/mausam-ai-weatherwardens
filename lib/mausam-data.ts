import { WeatherApiData } from "./weather-api";
import { AirQualityData } from "./air-quality-api";
import { UserRoutines } from "./user-profile";

import {
  MausamWeatherData,
  transformWeatherData,
} from "./weather-transformer";

export type MausamData = {
  location: string;

  weather: MausamWeatherData;

  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    ozone: number;
    uvIndex: number;
  };
};

export function createMausamData(
  weatherApiData: WeatherApiData,
  airQualityApiData: AirQualityData,
  location: string,
  routines: UserRoutines = {}
): MausamData {
  const weather = transformWeatherData(
    weatherApiData,
    location,
    routines
  );

  return {
    location,

    weather,

    airQuality: {
      aqi: Math.round(
        airQualityApiData.current.us_aqi
      ),

      pm25: Math.round(
        airQualityApiData.current.pm2_5
      ),

      pm10: Math.round(
        airQualityApiData.current.pm10
      ),

      ozone: Math.round(
        airQualityApiData.current.ozone
      ),

      uvIndex: Math.round(
        airQualityApiData.current.uv_index
      ),
    },
  };
}