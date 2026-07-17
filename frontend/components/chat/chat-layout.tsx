"use client";

import { useState } from "react";

import MessageList, { Message } from "./message-list";
import ChatInput from "./chat-input";
import { sendMessage } from "@/services/chat";

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm Nova. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, Nova ran into an error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold">Nova Chat</h1>

        <p className="mt-2 text-zinc-400">
          Your personal AI operating system.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-8">
        <div className="mx-auto max-w-4xl">
          <MessageList
            messages={messages}
            loading={loading}
          />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        loading={loading}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}