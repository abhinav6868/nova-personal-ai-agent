import {
  FileText,
  Brain,
  Search,
  Code2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import ActivityItem from "./activity-item";

const activities = [
  {
    title: "Resume Review",
    time: "2 minutes ago",
    icon: FileText,
  },
  {
    title: "Nova Dashboard",
    time: "15 minutes ago",
    icon: Brain,
  },
  {
    title: "Job Search",
    time: "1 hour ago",
    icon: Search,
  },
  {
    title: "LangGraph Debugging",
    time: "Today",
    icon: Code2,
  },
];

const focus = [
  "Complete dashboard redesign",
  "Implement streaming responses",
  "Push latest changes to GitHub",
];

export default function RecentActivity() {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-2">
      {/* Recent Conversations */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          💬 Recent Conversations
        </h2>

        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.title}
              {...activity}
            />
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          🎯 Today's Focus
        </h2>

        <div className="space-y-5">
          {focus.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
            >
              <CheckCircle2
                className="mt-0.5 text-cyan-400"
                size={18}
              />

              <div>
                <p className="text-white">{item}</p>

                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                  <Clock3 size={14} />
                  In Progress
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}