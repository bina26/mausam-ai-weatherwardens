import BottomNav from "@/components/BottomNav";
import PersonalizedDashboard from "@/components/PersonalizedDashboard";

import { fetchWeather } from "@/lib/weather-api";
import { fetchAirQuality } from "@/lib/air-quality-api";
import { createMausamData } from "@/lib/mausam-data";

import {
  Bell,
  Menu,
  MapPin,
  CloudSun,
  Droplets,
  Wind,
  Umbrella,
} from "lucide-react";
import { userProfile } from "@/lib/user-profile";

export default async function Home() {

  // ================= LIVE WEATHER DATA =================

  const latitude = 12.9716;
  const longitude = 77.5946;

  const [liveWeather, airQuality] =
    await Promise.all([
      fetchWeather(latitude, longitude),
      fetchAirQuality(latitude, longitude),
    ]);

  const mausamData = createMausamData(
  liveWeather,
  airQuality,
  "Bengaluru",
  userProfile.routines
);

  return (
    <main className="min-h-screen bg-[#07111f] pb-28 text-white">

      <div className="mx-auto max-w-md px-5 pt-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between">

          <button className="rounded-2xl bg-white/5 p-3">
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">

            <button className="relative rounded-2xl bg-white/5 p-3">
              <Bell size={21} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-400" />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 font-semibold">
              B
            </div>

          </div>

        </div>

        {/* ================= LOCATION ================= */}

        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">

          <MapPin
            size={17}
            className="text-sky-400"
          />

          <span>
            {mausamData.location}
          </span>

        </div>

        {/* ================= WEATHER HERO ================= */}

        <section className="mt-4 rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/15 to-blue-600/10 p-6">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-400">
                CURRENT WEATHER
              </p>

              <h2 className="mt-3 text-6xl font-bold">
                {mausamData.weather.current.temperature}°
              </h2>

              <p className="mt-2 text-lg text-slate-200">
                {mausamData.weather.current.condition}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Feels like{" "}
                {mausamData.weather.current.feelsLike}°
              </p>

            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-400/10">

              <CloudSun
                size={48}
                className="text-sky-300"
              />

            </div>

          </div>

          {/* ================= WEATHER STATS ================= */}

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">

            <div>

              <Droplets
                size={18}
                className="text-sky-400"
              />

              <p className="mt-2 text-xs text-slate-400">
                Humidity
              </p>

              <p className="mt-1 font-semibold">
                {mausamData.weather.current.humidity}%
              </p>

            </div>

            <div>

              <Wind
                size={18}
                className="text-sky-400"
              />

              <p className="mt-2 text-xs text-slate-400">
                Wind
              </p>

              <p className="mt-1 font-semibold">
                {mausamData.weather.current.windSpeed} km/h
              </p>

            </div>

            <div>

              <Umbrella
                size={18}
                className="text-sky-400"
              />

              <p className="mt-2 text-xs text-slate-400">
                Rain
              </p>

              <p className="mt-1 font-semibold">
                {mausamData.weather.current.rainChance}%
              </p>

            </div>

          </div>

        </section>

        {/* ================= PERSONALIZED DASHBOARD ================= */}

        <PersonalizedDashboard
          mausamData={mausamData}
        />

        {/* ================= TODAY SUMMARY ================= */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10">

              <CloudSun
                size={23}
                className="text-sky-400"
              />

            </div>

            <div>

              <p className="text-sm text-slate-400">
                TODAY&apos;S SUMMARY
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {mausamData.weather.current.condition}{" "}
                with a temperature of{" "}
                {mausamData.weather.current.temperature}°.
                Humidity is{" "}
                {mausamData.weather.current.humidity}%
                and the chance of rain is{" "}
                {mausamData.weather.current.rainChance}%.
              </p>

            </div>

          </div>

        </section>

      </div>

      {/* ================= BOTTOM NAV ================= */}

      <BottomNav />

    </main>
  );
}