import { Car, Umbrella } from "lucide-react";

type CommuteCardProps = {
  level: string;
  riskScore: number;
  commuteTime: string;
  rainChance: number;
  condition: string;
};

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function CommuteCard({
  level,
  riskScore,
  commuteTime,
  rainChance,
  condition,
}: CommuteCardProps) {
  const isHighRisk = level === "High";
  const isModerateRisk = level === "Moderate";

  const riskColor = isHighRisk
    ? "text-red-400"
    : isModerateRisk
      ? "text-amber-400"
      : "text-emerald-400";

  const heading = isHighRisk
    ? "Your commute may be affected"
    : isModerateRisk
      ? "Take care during your commute"
      : "Commute conditions look manageable";

  const message = isHighRisk
    ? "Weather conditions could disrupt your journey. Consider allowing extra travel time."
    : isModerateRisk
      ? "Some weather conditions may affect your journey. Check conditions before leaving."
      : "Weather conditions are currently unlikely to significantly affect your journey.";

  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15">
          <Umbrella
            size={24}
            className="text-amber-400"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Car
              size={16}
              className="text-amber-400"
            />

            <p className={`text-xs font-medium tracking-wide ${riskColor}`}>
              YOUR COMMUTE • {formatTime(commuteTime)} • {level.toUpperCase()} RISK
            </p>
          </div>

          <h3 className="mt-2 text-lg font-semibold">
            {heading}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {message}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300">
            <span>
              Weather: {condition}
            </span>

            <span>
              Rain chance: {rainChance}%
            </span>
          </div>

          <div className={`mt-4 text-sm font-medium ${riskColor}`}>
            Risk Score: {riskScore}/100
          </div>

          {(isHighRisk || rainChance >= 40) && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-300">
              <Umbrella size={16} />
              Consider carrying an umbrella
            </div>
          )}
        </div>
      </div>
    </div>
  );
}