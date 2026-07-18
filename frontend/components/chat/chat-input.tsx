"use client";

import { ArrowUp, Paperclip, Mic } from "lucide-react";

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
    <div className="w-full">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,255,255,0.05)] transition-all duration-300 focus-within:border-cyan-400/50">
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
            className="w-full bg-transparent px-6 pt-6 text-lg text-white placeholder:text-zinc-500 outline-none"
          />

          <div className="mt-5 flex items-center justify-between border-t border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="rounded-xl p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white">
                <Paperclip size={18} />
              </button>

              <button className="rounded-xl p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white">
                <Mic size={18} />
              </button>

              <span className="ml-2 text-xs text-zinc-600">
                Press Enter to send
              </span>
            </div>

            <button
              onClick={onSend}
              disabled={loading || !value.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}