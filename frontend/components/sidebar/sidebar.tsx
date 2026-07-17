"use client";

import Link from "next/link";
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
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
        active
          ? "bg-cyan-500/10 text-cyan-400"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{title}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-zinc-900 bg-[#09090B] p-5">
      <Logo />

      <nav className="mt-10 flex flex-col gap-2">
        {navigation.map((item, index) => (
          <SidebarItem
            key={item.href}
            {...item}
            active={index === 0}
          />
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
          System
        </p>

        <div className="space-y-3">
          {["LangGraph", "Memory", "Scheduler", "MCP"].map((status) => (
            <div
              key={status}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-zinc-400">{status}</span>

              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}