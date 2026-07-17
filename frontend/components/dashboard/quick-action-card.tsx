import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <button
      className="
        group
        flex
        flex-col
        items-start
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-5
        text-left
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-cyan-500/40
        hover:bg-zinc-900
      "
    >
      <div className="mb-4 rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
        <Icon size={22} />
      </div>

      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-zinc-400">
        {description}
      </p>
    </button>
  );
}