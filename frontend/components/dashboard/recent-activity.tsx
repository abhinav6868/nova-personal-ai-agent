import {
  FileText,
  Brain,
  Search,
  Code2,
} from "lucide-react";

import ActivityItem from "./activity-item";

const activities = [
  {
    title: "Resume reviewed",
    time: "2 minutes ago",
    icon: FileText,
  },
  {
    title: "Memory updated",
    time: "15 minutes ago",
    icon: Brain,
  },
  {
    title: "Job search completed",
    time: "1 hour ago",
    icon: Search,
  },
  {
    title: "Code generated",
    time: "Today",
    icon: Code2,
  },
];

export default function RecentActivity() {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-xl font-semibold">
        🕒 Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.title}
            {...activity}
          />
        ))}
      </div>
    </section>
  );
}