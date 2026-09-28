"use client";

import { useState } from "react";
import {
  userProfile,
  fitnessUser,
  healthUser,
  commuterUser,
  UserProfile,
} from "@/lib/user-profile";

type DemoUserSelectorProps = {
  onUserChange: (user: UserProfile) => void;
};

const profiles = [
  {
    label: "Rahul",
    description: "Fitness • 6:00 AM run",
    profile: fitnessUser,
    emoji: "🏃",
  },
  {
    label: "Priya",
    description: "Health focused",
    profile: healthUser,
    emoji: "🫁",
  },
  {
    label: "Arjun",
    description: "Commute • 9:00 AM",
    profile: commuterUser,
    emoji: "🚗",
  },
  {
    label: "Binayak",
    description: "Fitness • Health • Commute",
    profile: userProfile,
    emoji: "🧠",
  },
];

export default function DemoUserSelector({
  onUserChange,
}: DemoUserSelectorProps) {
  const [selected, setSelected] = useState("Binayak");
  const [open, setOpen] = useState(false);

  const currentProfile = profiles.find(
    (profile) => profile.label === selected
  )!;

  function handleSelect(profile: (typeof profiles)[number]) {
    setSelected(profile.label);
    setOpen(false);
    onUserChange(profile.profile);
  }

  return (
    <div className="relative mt-6">
      <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400">
        PERSONALIZATION PREVIEW
      </p>

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-xl">
            {currentProfile.emoji}
          </div>

          <div>
            <p className="font-semibold">
              {currentProfile.label}
            </p>

            <p className="text-xs text-slate-400">
              {currentProfile.description}
            </p>
          </div>
        </div>

        <span className="text-slate-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101c2d] shadow-2xl">
          {profiles.map((profile) => (
            <button
              key={profile.label}
              onClick={() => handleSelect(profile)}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-xl">
                {profile.emoji}
              </div>

              <div>
                <p className="font-semibold">
                  {profile.label}
                </p>

                <p className="text-xs text-slate-400">
                  {profile.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}