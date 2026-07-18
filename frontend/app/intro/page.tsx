export default function IntroPage() {
  return (
    <main className="flex h-screen items-center justify-center bg-[#030712]">
      <div className="text-center">
        <h1 className="text-7xl font-black tracking-[0.3em] text-white">
          NOVA
        </h1>

        <p className="mt-6 text-lg text-cyan-400">
          Your Personal AI Assistant
        </p>

        <button className="mt-12 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-8 py-4 text-white transition hover:bg-cyan-400/20">
          Enter Nova →
        </button>
      </div>
    </main>
  );
}