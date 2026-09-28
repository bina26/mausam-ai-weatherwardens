import { UserInterest } from "./user-profile";

export type InterestOption = {
  id: UserInterest;
  name: string;
  icon: string;
  description: string;
};

export const interestOptions: InterestOption[] = [
  {
    id: "fitness",
    name: "Fitness",
    icon: "🏃",
    description: "Best times for running and outdoor workouts",
  },
  {
    id: "health",
    name: "Health",
    icon: "🫁",
    description: "AQI, UV and weather conditions for your wellbeing",
  },
  {
    id: "commute",
    name: "Commute",
    icon: "🚗",
    description: "Weather conditions that may affect your journey",
  },
  {
    id: "travel",
    name: "Travel",
    icon: "✈️",
    description: "Weather insights for your trips and destinations",
  },
  {
    id: "family",
    name: "Family",
    icon: "👨‍👩‍👧",
    description: "Weather alerts for your family's daily routine",
  },
  {
    id: "gardening",
    name: "Gardening",
    icon: "🌱",
    description: "Rain, temperature and conditions for your plants",
  },
  {
    id: "events",
    name: "Events",
    icon: "🎉",
    description: "Outdoor comfort and weather planning",
  },
];