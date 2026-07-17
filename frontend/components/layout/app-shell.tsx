import Sidebar from "@/components/sidebar/sidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen bg-background">

      <Sidebar />

      <section className="flex-1 overflow-auto">

        {children}

      </section>

    </main>
  );
}