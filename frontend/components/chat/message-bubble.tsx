import { Bot, User } from "lucide-react";
import MarkdownRenderer from "./markdown-renderer";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({
  role,
  content,
}: MessageBubbleProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="mb-8 flex justify-end">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
            <span>You</span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-black">
              <User size={14} />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-zinc-100 backdrop-blur-xl">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 flex justify-start">
      <div className="w-full max-w-4xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Bot size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              NOVA
            </p>

            <p className="text-xs text-cyan-400">
              Personal AI Assistant
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="prose prose-invert max-w-none prose-p:leading-8 prose-headings:text-white">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}