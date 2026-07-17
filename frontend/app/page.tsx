import AppShell from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>

      <div className="flex h-full items-center justify-center">

        <div className="text-center">

          <h1 className="text-5xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="mt-4 text-zinc-500">
            Nova is ready.
          </p>

        </div>

      </div>

    </AppShell>
  );
}