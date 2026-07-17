"use client";

import { Search, Command, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#09090B]/80 px-8 backdrop-blur-md">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="flex h-10 w-72 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 text-sm text-zinc-400 transition-colors hover:border-zinc-700">
          <Search size={16} />
          <span className="flex-1 text-left">
            Search anything...
          </span>

          <div className="flex items-center gap-1 rounded-md border border-zinc-700 px-2 py-0.5 text-xs">
            <Command size={12} />
            K
          </div>
        </button>

        {/* Notifications */}
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/70 transition-colors hover:border-zinc-700 hover:bg-zinc-800">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-semibold text-black">
          A
        </div>
      </div>
    </header>
  );
}