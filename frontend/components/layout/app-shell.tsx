import Sidebar from "@/components/sidebar/sidebar";
import Topbar from "@/components/topbar/topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <section className="flex-1 overflow-auto">
          {children}
        </section>
      </div>
    </main>
  );
}