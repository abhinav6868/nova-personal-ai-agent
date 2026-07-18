"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Search,
  Code2,
  CalendarDays,
} from "lucide-react";

import MessageList, { Message } from "./message-list";
import ChatInput from "./chat-input";
import { streamMessage } from "@/services/chat";

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Scrollable chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const quickActions = [
    {
      label: "Research",
      icon: Search,
      prompt: "Research this topic",
    },
    {
      label: "Code",
      icon: Code2,
      prompt: "Help me write code",
    },
    {
      label: "Remember",
      icon: Brain,
      prompt: "Remember this information",
    },
    {
      label: "Plan",
      icon: CalendarDays,
      prompt: "Help me plan my day",
    },
  ];

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    try {
      await streamMessage(userMessage, (chunk: string) => {
        setMessages((prev) => {
          const updated = [...prev];

          const lastIndex = updated.length - 1;
          const last = updated[lastIndex];

          if (last && last.role === "assistant") {
            updated[lastIndex] = {
              ...last,
              content: last.content + chunk,
            };
          }

          return updated;
        });
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, Nova ran into an error.",
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  const hasConversation = messages.length > 0;

  return (
    <div className="relative flex h-[calc(100vh-80px)] flex-col overflow-hidden bg-[#05070A]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      {/* Hero */}
      <div
        className={`relative z-10 transition-all duration-700 ease-in-out ${
          hasConversation
            ? "border-b border-white/10 py-8"
            : "flex flex-1 flex-col items-center justify-center"
        }`}
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-400">
            PERSONAL AI ASSISTANT
          </p>

          <h1
            className={`mt-4 font-black tracking-tight text-white transition-all duration-700 ${
              hasConversation ? "text-4xl" : "text-7xl"
            }`}
          >
            NOVA
          </h1>

          <p className="mt-6 text-lg text-zinc-400">
            Ready when you are.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              READY
            </div>
          </div>

          {!hasConversation && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.label}
                    onClick={() => setInput(action.prompt)}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-300 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white"
                  >
                    <Icon
                      size={16}
                      className="text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                    />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {hasConversation && (
        <div
          ref={chatContainerRef}
          className="relative z-10 flex-1 overflow-y-auto px-6 py-8"
        >
          <div className="mx-auto max-w-4xl">
            <MessageList messages={messages} />
          </div>
        </div>
      )}

      <div
        className={`relative z-10 px-6 pb-10 transition-all duration-700 ${
          hasConversation
            ? "border-t border-white/10 bg-black/30 backdrop-blur-xl"
            : "-mt-28"
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <ChatInput
            value={input}
            loading={loading}
            onChange={setInput}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}