"use client";

import { useMemo, useState } from "react";

import DemoUserSelector from "@/components/DemoUserSelector";

import RunningCard from "@/components/RunningCard";
import CommuteCard from "@/components/CommuteCard";
import AQICard from "@/components/AQICard";

import {
  userProfile,
  UserProfile,
} from "@/lib/user-profile";

import {
  getPersonalizedCards,
  prioritizeCards,
} from "@/lib/personalization";

import { getRecommendations } from "@/lib/recommendations";

import {
  calculateRunningScore,
  calculateCommuteRisk,
  getAQIStatus,
} from "@/lib/scoring";

import { MausamData } from "@/lib/mausam-data";

import {
  ChevronDown,
  Sparkles,
} from "lucide-react";

type PersonalizedDashboardProps = {
  mausamData: MausamData;
};

export default function PersonalizedDashboard({
  mausamData,
}: PersonalizedDashboardProps) {

  const [selectedUser, setSelectedUser] =
    useState<UserProfile>(userProfile);

  // ================= WEATHER INTELLIGENCE =================

  const runningResult = useMemo(() => {
    return calculateRunningScore({
      ...mausamData.weather.tomorrowMorning,
      uvIndex: mausamData.airQuality.uvIndex,
      aqi: mausamData.airQuality.aqi,
    });
  }, [mausamData]);

  const commuteResult = useMemo(() => {
    return calculateCommuteRisk(
      mausamData.weather.commute
    );
  }, [mausamData]);

  const aqiStatus = useMemo(() => {
    return getAQIStatus(
      mausamData.airQuality.aqi
    );
  }, [mausamData]);

  // ================= PERSONALIZATION =================

  const personalizedCards = useMemo(() => {
    return getPersonalizedCards(selectedUser);
  }, [selectedUser]);

  const prioritizedCards = useMemo(() => {
    return prioritizeCards(
      personalizedCards,
      mausamData
    );
  }, [
    personalizedCards,
    mausamData,
  ]);

  // ================= RECOMMENDATIONS =================

  const recommendations = useMemo(() => {
    return getRecommendations(
      selectedUser,
      mausamData
    );
  }, [
    selectedUser,
    mausamData,
  ]);

  return (
    <>
      {/* ================= USER SELECTOR ================= */}

      <DemoUserSelector
        onUserChange={setSelectedUser}
      />

      {/* ================= GREETING ================= */}

      <section className="mt-8">
        <p className="text-sm text-slate-400">
          Good Evening,
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {selectedUser.name} 👋
        </h1>
      </section>

      {/* ================= PERSONALIZED SECTION ================= */}

      <section className="mt-8">

        <div>
          <p className="text-sm text-sky-400">
            JUST FOR YOU
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Personalized For You
          </h2>
        </div>

        {/* ================= DYNAMIC CARDS ================= */}

        <div className="mt-5 space-y-4">

          {prioritizedCards.map(({ card }) => {

            if (card === "running") {
              return (
                <RunningCard
  key={card}
  score={runningResult.score}
  status={runningResult.status}
  runningTime={
    selectedUser.routines?.runningTime ?? "06:00"
  }
  temperature={
    mausamData.weather.tomorrowMorning.temperature
  }
  uvIndex={mausamData.airQuality.uvIndex}
  aqiStatus={aqiStatus}
/>
              );
            }

            if (card === "commute") {
              return (
                <CommuteCard
  key={card}
  level={commuteResult.level}
  riskScore={commuteResult.riskScore}
  commuteTime={
    selectedUser.routines?.commuteTime ?? "09:00"
  }
  rainChance={
    mausamData.weather.commute.rainChance
  }
  condition={
    mausamData.weather.commute.condition
  }
/>
              );
            }

            if (card === "aqi") {
              return (
                <AQICard
                  key={card}
                  aqi={mausamData.airQuality.aqi}
                  status={aqiStatus}
                />
              );
            }

            return null;
          })}

        </div>

      </section>

      {/* ================= MAUSAM AI INSIGHTS ================= */}

      <section className="mt-8">

        <div className="flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-sky-400"
          />

          <div>
            <p className="text-sm text-sky-400">
              MAUSAM AI
            </p>

            <h2 className="text-2xl font-bold">
              Smart Insights
            </h2>
          </div>

        </div>

        {/* ================= RECOMMENDATIONS ================= */}

        <div className="mt-5 space-y-4">

          {recommendations.map(
            (recommendation) => (

              <div
                key={recommendation.id}
                className="rounded-3xl border border-sky-400/10 bg-sky-400/5 p-5"
              >

                <p className="text-base font-semibold">
                  {recommendation.title}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {recommendation.message}
                </p>

                {/* ================= WHY ================= */}

                <div className="mt-5 border-t border-white/10 pt-4">

                  <div className="flex items-center gap-2">

                    <ChevronDown
                      size={16}
                      className="text-sky-400"
                    />

                    <p className="text-xs font-semibold tracking-wider text-sky-400">
                      WHY THIS RECOMMENDATION?
                    </p>

                  </div>

                  <ul className="mt-3 space-y-2">

                    {recommendation.explanation.map(
                      (reason, index) => (

                        <li
                          key={index}
                          className="flex gap-2 text-sm text-slate-400"
                        >

                          <span className="text-sky-400">
                            •
                          </span>

                          <span>
                            {reason}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                </div>

              </div>

            )
          )}

        </div>

      </section>
    </>
  );
}