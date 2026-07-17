import {
  Briefcase,
  FileText,
  Search,
  Code2,
  Globe,
  GraduationCap,
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
      <h2 className="mb-6 text-xl font-semibold">
        ⚡ Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            {...action}
          />
        ))}
      </div>
    </section>
  );
}