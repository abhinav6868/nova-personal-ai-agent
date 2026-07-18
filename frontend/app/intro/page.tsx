"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Brain,
  Search,
  CalendarDays,
  Code2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "MEMORY",
    status: "ONLINE",
    description: "Never lose what matters.",
  },
  {
    icon: Search,
    title: "RESEARCH",
    status: "READY",
    description: "Find answers, not links.",
  },
  {
    icon: CalendarDays,
    title: "PLANNER",
    status: "READY",
    description: "Stay ahead of your day.",
  },
  {
    icon: Code2,
    title: "WORKSPACE",
    status: "MOUNTED",
    description: "Think. Build. Create.",
  },
];

export default function IntroPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04060B] text-white">
      {/* Aurora */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_65%)]" />

      {/* Glow */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[170px]"
      />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(103,232,249,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.5)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating particles */}
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.15, 0.6, 0.15],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
          className="absolute rounded-full bg-cyan-300"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* HUD */}
      <div className="pointer-events-none absolute inset-6">
        <span className="absolute left-0 top-0 text-[11px] tracking-[0.35em] text-cyan-400/60">
          NOVA://SYSTEM
        </span>

        <span className="absolute right-0 top-0 text-[11px] tracking-[0.35em] text-cyan-400/60">
          BUILD v0.1
        </span>
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-8">
        {/* Energy Core */}
        <div className="relative mb-14 h-28 w-28">
          <motion.div
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 blur-xl"
          />

          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(103,232,249,0.45)"
              strokeWidth="1"
              strokeDasharray="5 8"
            />
          </motion.svg>

          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-3"
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </motion.svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl font-black tracking-[0.35em] md:text-[120px]"
        >
          NOVA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-lg tracking-[0.35em] text-cyan-400"
        >
          PERSONAL AI OPERATING SYSTEM
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400"
        >
          Built to remember, research, organize and help you think.
          One intelligent workspace for everything.
        </motion.p>

        <div className="mt-20 grid w-full max-w-5xl gap-5 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.9 + index * 0.12,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:shadow-[0_0_45px_rgba(34,211,238,0.18)]"
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 transition duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon size={22} />
                    </div>

                    <div>
                      <p className="text-xs tracking-[0.25em] text-cyan-400/60">
                        {feature.status}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold tracking-[0.12em]">
                        {feature.title}
                      </h3>

                      <p className="mt-3 max-w-[220px] text-sm leading-6 text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-zinc-600 transition-all duration-300 group-hover:translate-x-2 group-hover:text-cyan-300"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ENTER BUTTON */}
        <motion.button
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/init")}
          className="group relative mt-20 overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-500/10 px-10 py-5 backdrop-blur-xl transition-all duration-500 hover:border-cyan-300 hover:shadow-[0_0_45px_rgba(34,211,238,0.35)]"
        >
          {/* Shine */}
          <motion.div
            initial={{ x: "-140%" }}
            whileHover={{ x: "220%" }}
            transition={{ duration: 0.9 }}
            className="absolute inset-y-0 w-24 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <div className="relative flex items-center gap-4">
            <span className="text-lg font-semibold tracking-[0.35em]">
              ENTER NOVA
            </span>

            <ArrowRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-2 group-hover:text-cyan-300"
            />
          </div>
        </motion.button>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 text-center text-[11px] tracking-[0.35em] text-cyan-400/40"
        >
          MEMORY • RESEARCH • PLANNER • WORKSPACE
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#04060B] to-transparent" />
    </main>
  );
}