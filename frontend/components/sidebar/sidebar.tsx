"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/logo";
import { navigation } from "@/lib/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

function SidebarItem({
  title,
  href,
  icon: Icon,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
        active
          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10"
          : "border-transparent text-zinc-400 hover:border-cyan-500/20 hover:bg-zinc-900/70 hover:text-white"
      }`}
    >
      <Icon
        size={18}
        className="transition-colors duration-300"
      />

      <span className="font-medium">{title}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const systems = [
    "AI Online",
    "Memory Synced",
    "Scheduler Ready",
    "MCP Connected",
  ];

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-zinc-900 bg-[#09090B] p-5">
      <Logo />

      <nav className="mt-10 flex flex-col gap-2">
        {navigation.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          NOVA STATUS
        </p>

        <div className="space-y-4">
          {systems.map((status) => (
            <div
              key={status}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-zinc-300">{status}</span>

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-3">
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Nova Core
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            All systems operational
          </p>
        </div>
      </div>
    </aside>
  );
}