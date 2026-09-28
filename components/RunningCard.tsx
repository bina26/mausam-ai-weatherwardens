import { PersonStanding } from "lucide-react";

type RunningCardProps = {
  score: number;
  status: string;
  runningTime: string;
  temperature: number;
  uvIndex: number;
  aqiStatus: string;
};

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function RunningCard({
  score,
  status,
  runningTime,
  temperature,
  uvIndex,
  aqiStatus,
}: RunningCardProps) {
  const isGood = score >= 75;

  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-sky-400/10 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15">
            <PersonStanding
              size={25}
              className="text-emerald-400"
            />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              BEST TIME TO RUN
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              Tomorrow Morning
            </h3>
          </div>
        </div>

        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-400">
          {status}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-3xl font-bold">
          {formatTime(runningTime)}
        </p>

        <p className="mt-2 text-sm text-emerald-400">
          Running Score: {score}/100
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {isGood
            ? "Weather conditions look favorable for your outdoor morning routine."
            : "Weather conditions may affect your planned outdoor workout. Check conditions before heading out."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-sm">
        <span className="text-slate-300">
          🌡️ {temperature}°C
        </span>

        <span className="text-slate-300">
          ☀️ UV {uvIndex}
        </span>

        <span className="text-slate-300">
          🫁 AQI {aqiStatus}
        </span>
      </div>
    </div>
  );
}