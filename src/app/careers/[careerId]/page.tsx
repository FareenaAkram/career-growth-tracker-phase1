import { getCareerById } from "@/data/careers";
import { notFound } from "next/navigation";
import RoadmapVisualization from "@/components/roadmap/RoadmapVisualization";
import SaveCareerButton from "@/components/careers/SaveCareerButton";
import {
  ClockIcon,
  BriefcaseIcon,
  SparklesIcon,
  FireIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

function MetaPill({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  label: string;
  sub: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
      </div>
      <div>
        <div className="text-sm font-semibold text-white leading-tight">{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

export default async function CareerDetailPage({ params }: any) {
  const p = await params;
  const career = getCareerById(p.careerId);
  if (!career) return notFound();

  const minK = Math.floor(career.salaryRange.min / 1000);
  const maxK = Math.floor(career.salaryRange.max / 1000);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 45%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {career.title}
            </h1>
            <CheckBadgeIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-0.5" />
          </div>
          <p className="mt-2 text-sm" style={{ color: "#94a3b8" }}>
            {career.description}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1">
          <SaveCareerButton careerId={career.id} />
        </div>
      </div>

      {/* Metadata pills */}
      <div className="mt-5 flex flex-wrap gap-3">
        <MetaPill
          icon={SparklesIcon}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-400/10"
          label="Beginner Friendly"
          sub="Start from scratch"
        />
        <MetaPill
          icon={ClockIcon}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
          label={career.timeToJobReady}
          sub="Estimated time"
        />
        <MetaPill
          icon={FireIcon}
          iconColor="text-sky-400"
          iconBg="bg-sky-400/10"
          label="High Demand"
          sub="Great career future"
        />
        <MetaPill
          icon={BriefcaseIcon}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          label="Avg Salary"
          sub={`$${minK}K – $${maxK}K`}
        />
      </div>

      {/* Roadmap */}
      <div className="mt-8">
        <RoadmapVisualization careerId={career.id} />
      </div>
    </div>
  );
}
