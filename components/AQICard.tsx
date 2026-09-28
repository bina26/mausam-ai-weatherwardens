import { Wind } from "lucide-react";

type AQICardProps = {
  aqi: number;
  status: string;
};

export default function AQICard({
  aqi,
  status,
}: AQICardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wind
              size={18}
              className="text-sky-400"
            />

            <p className="text-sm text-slate-400">
              AIR QUALITY
            </p>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold">
              {aqi}
            </span>

            <span className="mb-2 text-sm text-emerald-400">
              {status}
            </span>
          </div>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-400/30">
          <span className="text-sm font-medium text-emerald-400">
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {status === "Excellent" || status === "Good"
          ? "Great conditions for outdoor activities."
          : "Consider limiting prolonged outdoor activities."}
      </p>
    </div>
  );
}