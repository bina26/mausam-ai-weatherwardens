export type UserInterest =
  | "fitness"
  | "health"
  | "commute"
  | "travel"
  | "family"
  | "gardening"
  | "events";

export type UserRoutines = {
  runningTime?: string;
  commuteTime?: string;
};

export type UserProfile = {
  name: string;

  interests: UserInterest[];

  routines?: UserRoutines;
};

// 👤 FITNESS USER

export const fitnessUser: UserProfile = {
  name: "Rahul",

  interests: ["fitness"],

  routines: {
    runningTime: "06:00",
  },
};

// 🫁 HEALTH-CONSCIOUS USER

export const healthUser: UserProfile = {
  name: "Priya",

  interests: ["health"],
};

// 🚗 COMMUTER USER

export const commuterUser: UserProfile = {
  name: "Arjun",

  interests: ["commute"],

  routines: {
    commuteTime: "09:00",
  },
};

// 🧠 FULL PERSONALIZED USER

export const userProfile: UserProfile = {
  name: "Binayak",

  interests: [
    "fitness",
    "health",
    "commute",
  ],

  routines: {
    runningTime: "06:00",
    commuteTime: "09:00",
  },
};