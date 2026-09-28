export type RoutineType =
  | "workout"
  | "commute"
  | "walk"
  | "outdoor"
  | "gardening";

export type UserRoutine = {
  id: string;
  type: RoutineType;
  label: string;
  time: string;
  enabled: boolean;
};

export const userRoutines: UserRoutine[] = [
  {
    id: "morning-workout",
    type: "workout",
    label: "Morning Workout",
    time: "6:00 AM",
    enabled: true,
  },
  {
    id: "college-commute",
    type: "commute",
    label: "College Commute",
    time: "8:00 AM",
    enabled: true,
  },
];