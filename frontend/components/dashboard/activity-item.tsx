import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  title: string;
  time: string;
  icon: LucideIcon;
}

export default function ActivityItem({
  title,
  time,
  icon: Icon,
}: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-cyan-500/30">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
          <Icon size={18} />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-zinc-500">{time}</p>
        </div>
      </div>
    </div>
  );
}