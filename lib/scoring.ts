type RunningConditions = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  aqi: number;
};

export function calculateRunningScore(
  conditions: RunningConditions
) {
  let score = 100;

  // 🌡 Temperature
  if (conditions.temperature > 30 || conditions.temperature < 10) {
    score -= 20;
  } else if (conditions.temperature > 27 || conditions.temperature < 15) {
    score -= 10;
  }

  // 💧 Humidity
  if (conditions.humidity > 85) {
    score -= 15;
  } else if (conditions.humidity > 75) {
    score -= 8;
  }

  // 💨 Wind
  if (conditions.windSpeed > 25) {
    score -= 15;
  } else if (conditions.windSpeed > 15) {
    score -= 7;
  }

  // 🌧 Rain
  if (conditions.rainChance > 70) {
    score -= 30;
  } else if (conditions.rainChance > 40) {
    score -= 15;
  } else if (conditions.rainChance > 20) {
    score -= 5;
  }

  // ☀️ UV
  if (conditions.uvIndex > 8) {
    score -= 20;
  } else if (conditions.uvIndex > 5) {
    score -= 10;
  }

  // 🫁 AQI
  if (conditions.aqi > 200) {
    score -= 30;
  } else if (conditions.aqi > 150) {
    score -= 20;
  } else if (conditions.aqi > 100) {
    score -= 10;
  }

  score = Math.max(0, score);

  let status = "Excellent";

  if (score < 50) {
    status = "Avoid";
  } else if (score < 70) {
    status = "Moderate";
  } else if (score < 85) {
    status = "Good";
  }

  return {
    score,
    status,
  };
}


type CommuteConditions = {
  rainChance: number;
  windSpeed: number;
  visibility: string;
};

export function calculateCommuteRisk(
  conditions: CommuteConditions
) {
  let riskScore = 0;

  // 🌧 Rain
  if (conditions.rainChance > 70) {
    riskScore += 50;
  } else if (conditions.rainChance > 40) {
    riskScore += 25;
  }

  // 💨 Wind
  if (conditions.windSpeed > 30) {
    riskScore += 30;
  } else if (conditions.windSpeed > 20) {
    riskScore += 15;
  }

  // 👁 Visibility
  if (conditions.visibility === "Poor") {
    riskScore += 30;
  } else if (conditions.visibility === "Moderate") {
    riskScore += 15;
  }

  let level = "Low";

  if (riskScore >= 60) {
    level = "High";
  } else if (riskScore >= 30) {
    level = "Moderate";
  }

  return {
    riskScore,
    level,
  };
}


export function getAQIStatus(aqi: number) {
  if (aqi <= 50) {
    return "Excellent";
  }

  if (aqi <= 100) {
    return "Good";
  }

  if (aqi <= 150) {
    return "Moderate";
  }

  if (aqi <= 200) {
    return "Poor";
  }

  return "Hazardous";
}