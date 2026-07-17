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

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl items-start gap-3 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isUser
              ? "bg-cyan-500 text-black"
              : "bg-zinc-800 text-white"
          }`}
        >
          {isUser ? (
            <User size={18} />
          ) : (
            <Bot size={18} />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-sm ${
            isUser
              ? "bg-cyan-500 text-black"
              : "border border-zinc-800 bg-zinc-900 text-white"
          }`}
        >
          <p className="whitespace-pre-wrap leading-7">
            <MarkdownRenderer content={content} />
          </p>
        </div>
      </div>
    </div>
  );
}