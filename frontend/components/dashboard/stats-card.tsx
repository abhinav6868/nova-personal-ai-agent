import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-cyan-500/30 hover:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-zinc-400">{title}</span>

        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
          <Icon size={18} />
        </div>
      </div>

      <h3 className="text-3xl font-bold">{value}</h3>

      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}