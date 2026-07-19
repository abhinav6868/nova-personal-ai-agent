import {
  ArrowUpRight,
  Briefcase,
  Code2,
  FileText,
  Globe,
  GraduationCap,
  Search,
} from "lucide-react";

import QuickActionCard from "./quick-action-card";

const actions = [
  {
    title: "Resume Review",
    description: "Analyze and improve your resume.",
    icon: Briefcase,
  },
  {
    title: "Research Paper",
    description: "Write or summarize research papers.",
    icon: GraduationCap,
  },
  {
    title: "Job Search",
    description: "Find internships and jobs.",
    icon: Search,
  },
  {
    title: "Summarize PDF",
    description: "Extract insights from documents.",
    icon: FileText,
  },
  {
    title: "Write Code",
    description: "Generate or debug code.",
    icon: Code2,
  },
  {
    title: "Browse Web",
    description: "Search the latest information.",
    icon: Globe,
  },
];

export default function QuickActions() {
  return (
    <section className="mt-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            NOVA
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            What can I help you accomplish today?
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Research, write code, analyze documents, plan your day,
            remember important details, and automate your workflow.
          </p>

          <button className="mt-8 flex w-full max-w-2xl items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 px-6 py-5 text-left transition hover:border-cyan-500/30">
            <span className="text-zinc-500">
              Ask Nova anything...
            </span>

            <ArrowUpRight className="text-cyan-400" size={20} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10">
        <h3 className="mb-5 text-lg font-semibold text-white">
          Quick Actions
        </h3>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <QuickActionCard
              key={action.title}
              {...action}
            />
          ))}
        </div>
      </div>
    </section>
  );
}