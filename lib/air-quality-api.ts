export type AirQualityData = {
  current: {
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    uv_index: number;
  };
};

export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityData> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=us_aqi,pm2_5,pm10,ozone,uv_index`;

  const response = await fetch(url, {
    next: {
      revalidate: 1800,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch air quality data");
  }

  return response.json();
}