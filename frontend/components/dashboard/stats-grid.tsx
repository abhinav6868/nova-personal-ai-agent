import {
  Brain,
  Clock3,
  FileText,
  CheckCircle2,
} from "lucide-react";

import StatsCard from "./stats-card";

export default function StatsGrid() {
  return (
    <section className="mt-10">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Memories"
          value="24"
          subtitle="Stored conversations"
          icon={Brain}
        />

        <StatsCard
          title="Documents"
          value="12"
          subtitle="Indexed files"
          icon={FileText}
        />

        <StatsCard
          title="Tasks"
          value="5"
          subtitle="Scheduled automations"
          icon={Clock3}
        />

        <StatsCard
          title="Agent Health"
          value="100%"
          subtitle="All systems operational"
          icon={CheckCircle2}
        />
      </div>
    </section>
  );
}