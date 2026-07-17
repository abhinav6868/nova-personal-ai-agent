import MessageBubble from "./message-bubble";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({
  messages,
  loading,
}: MessageListProps) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          role={message.role}
          content={message.content}
        />
      ))}

      {loading && (
        <MessageBubble
          role="assistant"
          content="Nova is thinking..."
        />
      )}
    </div>
  );
}