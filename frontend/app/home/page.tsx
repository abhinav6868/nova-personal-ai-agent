import AppShell from "@/components/layout/app-shell";
import QuickActions from "@/components/dashboard/quick-actions";
import StatsGrid from "@/components/dashboard/stats-grid";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function HomePage() {
  return (
    <AppShell>
      <div className="p-8">
        <h2 className="text-4xl font-bold tracking-tight">
          Welcome back 👋
        </h2>

        <p className="mt-2 text-zinc-400">
          Nova is ready to help you today.
        </p>

        <QuickActions />

        <StatsGrid />

        <RecentActivity />
      </div>
    </AppShell>
  );
}