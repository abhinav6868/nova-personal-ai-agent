"use client";

import { Bell, Command, Search } from "lucide-react";

export default function Topbar() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-900 bg-[#09090B]/80 px-8 backdrop-blur-xl">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {greeting}
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Nova is online • All systems operational
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 transition hover:border-cyan-500/30 hover:bg-zinc-900">
          <Search
            size={16}
            className="text-zinc-400 group-hover:text-cyan-400"
          />

          <span className="text-sm text-zinc-500">
            Search...
          </span>

          <div className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-500">
            ⌘K
          </div>
        </button>

        {/* Notifications */}
        <button className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition hover:border-cyan-500/30 hover:text-cyan-400">
          <Bell size={18} />
        </button>

        {/* Command Palette */}
        <button className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition hover:border-cyan-500/30 hover:text-cyan-400">
          <Command size={18} />
        </button>

        {/* Avatar */}
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20">
          A
        </button>
      </div>
    </header>
  );
}