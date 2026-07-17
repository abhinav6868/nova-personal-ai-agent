import AppShell from "@/components/layout/app-shell";

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
      </div>
    </AppShell>
  );
}