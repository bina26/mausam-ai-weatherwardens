import { UserProfile } from "./user-profile";
import { MausamData } from "./mausam-data";
import {
  calculateRunningScore,
  calculateCommuteRisk,
  getAQIStatus,
} from "./scoring";

export type Recommendation = {
  id: string;
  title: string;
  message: string;
  explanation: string[];
  priority: number;
  category: "fitness" | "health" | "commute";
};

export function getRecommendations(
  user: UserProfile,
  mausamData: MausamData
): Recommendation[] {
  const recommendations: Recommendation[] = [];

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

  // 🫁 LIVE AQI INTELLIGENCE

  const aqi = mausamData.airQuality.aqi;

  const aqiStatus = getAQIStatus(aqi);

  // 🏃 FITNESS RECOMMENDATION

  if (user.interests.includes("fitness")) {
    if (runningResult.score >= 75) {
      recommendations.push({
        id: "fitness-good",
        title: "Great time for your workout",
        message:
          "Tomorrow morning has favorable weather conditions for your outdoor workout.",
        explanation: [
          `Running conditions scored ${runningResult.score}/100`,
          "Weather conditions are favorable for outdoor activity",
          "Your fitness interest and morning routine were considered",
        ],
        priority: 70,
        category: "fitness",
      });
    } else if (runningResult.score >= 50) {
      recommendations.push({
        id: "fitness-moderate",
        title: "Workout with caution",
        message:
          "Conditions are manageable, but weather may affect your outdoor workout.",
        explanation: [
          `Running conditions scored ${runningResult.score}/100`,
          "Some weather factors may affect outdoor activity",
          "Your planned fitness activity was considered",
        ],
        priority: 80,
        category: "fitness",
      });
    } else {
      recommendations.push({
        id: "fitness-poor",
        title: "Consider an indoor workout",
        message:
          "Weather conditions may not be suitable for your planned outdoor workout.",
        explanation: [
          `Running conditions scored only ${runningResult.score}/100`,
          "Current weather conditions may affect outdoor exercise",
          "An indoor alternative may provide a safer experience",
        ],
        priority: 95,
        category: "fitness",
      });
    }
  }

  // 🚗 COMMUTE RECOMMENDATION

  if (user.interests.includes("commute")) {
    if (commuteResult.level === "High") {
      recommendations.push({
        id: "commute-high",
        title: "Your commute may be affected",
        message:
          "Weather conditions may impact your journey. Consider leaving earlier.",
        explanation: [
          `Commute risk is currently ${commuteResult.level}`,
          `Weather risk score: ${commuteResult.riskScore}/100`,
          "Your regular commute requirements were considered",
        ],
        priority: 100,
        category: "commute",
      });
    } else if (commuteResult.level === "Moderate") {
      recommendations.push({
        id: "commute-moderate",
        title: "Plan your commute carefully",
        message:
          "Some weather conditions may affect your journey today.",
        explanation: [
          `Commute risk is currently ${commuteResult.level}`,
          `Weather risk score: ${commuteResult.riskScore}/100`,
          "Some weather conditions could affect travel",
        ],
        priority: 80,
        category: "commute",
      });
    } else {
      recommendations.push({
        id: "commute-low",
        title: "Commute conditions look good",
        message:
          "Weather conditions are unlikely to significantly affect your journey.",
        explanation: [
          `Commute risk is currently ${commuteResult.level}`,
          `Weather risk score: ${commuteResult.riskScore}/100`,
          "No major weather disruption is currently detected",
        ],
        priority: 60,
        category: "commute",
      });
    }
  }

  // 🫁 HEALTH / AQI RECOMMENDATION

  if (user.interests.includes("health")) {
    if (
      aqiStatus === "Excellent" ||
      aqiStatus === "Good"
    ) {
      recommendations.push({
        id: "aqi-good",
        title: "Air quality looks good",
        message:
          "Outdoor conditions are generally favorable based on current air quality.",
        explanation: [
          `Current AQI is ${aqi}`,
          `Air quality status is ${aqiStatus}`,
          "Your health and outdoor activity preferences were considered",
        ],
        priority: 60,
        category: "health",
      });
    } else {
      recommendations.push({
        id: "aqi-warning",
        title: "Air quality needs attention",
        message:
          "Consider reducing prolonged outdoor exposure based on current air quality.",
        explanation: [
          `Current AQI is ${aqi}`,
          `Air quality status is ${aqiStatus}`,
          "Poor air quality may affect prolonged outdoor exposure",
        ],
        priority: 95,
        category: "health",
      });
    }
  }

  // 🔥 Highest priority first

  return recommendations.sort(
    (a, b) => b.priority - a.priority
  );
}