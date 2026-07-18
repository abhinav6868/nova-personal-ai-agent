import { api } from "./api";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export async function sendMessage(message: string) {
  const { data } = await api.post<ChatResponse>("/chat/", {
    message,
  });

  return data;
}

export async function streamMessage(
  message: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch("http://localhost:8000/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to stream response.");
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("No response stream.");
  }

  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    console.log("STREAM:", chunk);

    onChunk(chunk);
  }
}