"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Clock3,
  FileText,
  CheckCircle2,
} from "lucide-react";

import StatsCard from "./stats-card";
import { getHealth } from "@/services/health";

export default function StatsGrid() {
  const [healthy, setHealthy] = useState(false);

  useEffect(() => {
    getHealth()
      .then((res) => {
        setHealthy(res.status === "healthy");
      })
      .catch(console.error);
  }, []);

  return (
    <section className="mt-10">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
           title="Memory"
           value="24 Memories"
           subtitle="Recently updated"
           icon={Brain}
       />

        <StatsCard
           title="Workspace"
           value="12 Files"
           subtitle="Ready to search"
           icon={FileText}
       />

       <StatsCard
          title="Planner"
          value="5 Tasks"
          subtitle="Today's schedule"
           icon={Clock3}
        />

        <StatsCard
           title="Nova Status"
           value={healthy ? "🟢 Online" : "🔴 Offline"}
           subtitle={
              healthy
                  ? "All systems operational"
                  : "Unable to reach backend"
           }
           icon={CheckCircle2}
       />
      </div>
    </section>
  );
}