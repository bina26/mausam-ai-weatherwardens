import { UserProfile } from "./user-profile";
import { MausamData } from "./mausam-data";
import {
  calculateRunningScore,
  calculateCommuteRisk,
} from "./scoring";

export type PersonalizedCard =
  | "running"
  | "aqi"
  | "commute"
  | "travel"
  | "family"
  | "gardening"
  | "events";

export type PrioritizedCard = {
  card: PersonalizedCard;
  priority: number;
};

export function getPersonalizedCards(
  user: UserProfile
): PersonalizedCard[] {
  const cards: PersonalizedCard[] = [];

  if (user.interests.includes("fitness")) {
    cards.push("running");
  }

  if (user.interests.includes("health")) {
    cards.push("aqi");
  }

  if (user.interests.includes("commute")) {
    cards.push("commute");
  }

  if (user.interests.includes("travel")) {
    cards.push("travel");
  }

  if (user.interests.includes("family")) {
    cards.push("family");
  }

  if (user.interests.includes("gardening")) {
    cards.push("gardening");
  }

  if (user.interests.includes("events")) {
    cards.push("events");
  }

  return cards;
}

export function prioritizeCards(
  cards: PersonalizedCard[],
  mausamData: MausamData
): PrioritizedCard[] {

  // 🏃 LIVE RUNNING INTELLIGENCE

  const runningResult = calculateRunningScore({
    ...mausamData.weather.tomorrowMorning,
    uvIndex: mausamData.airQuality.uvIndex,
    aqi: mausamData.airQuality.aqi,
  });

  // 🚗 LIVE COMMUTE INTELLIGENCE

  const commuteResult = calculateCommuteRisk(
    mausamData.weather.commute
  );

  // 🧠 PRIORITIZE PERSONALIZED CARDS

  return cards
    .map((card) => {

      let priority = 50;

      // 🏃 Running priority

      if (card === "running") {
        priority = 60;

        if (runningResult.score < 50) {
          priority = 90;
        } else if (runningResult.score < 70) {
          priority = 75;
        }
      }

      // 🚗 Commute priority

      if (card === "commute") {
        priority = 60;

        if (commuteResult.level === "High") {
          priority = 100;
        } else if (commuteResult.level === "Moderate") {
          priority = 80;
        }
      }

      // 🫁 AQI priority

      if (card === "aqi") {
        const aqi = mausamData.airQuality.aqi;

        priority = 60;

        if (aqi > 200) {
          priority = 100;
        } else if (aqi > 150) {
          priority = 90;
        } else if (aqi > 100) {
          priority = 75;
        }
      }

      return {
        card,
        priority,
      };
    })

    // 🔥 Highest priority first

    .sort((a, b) => b.priority - a.priority);
}