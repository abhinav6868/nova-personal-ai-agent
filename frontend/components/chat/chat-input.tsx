"use client";

interface ChatInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  loading,
  onChange,
  onSend,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-800 bg-background p-6">
      <div className="mx-auto flex max-w-4xl gap-4">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask Nova anything..."
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white outline-none transition focus:border-cyan-500"
        />

        <button
          onClick={onSend}
          disabled={loading}
          className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}