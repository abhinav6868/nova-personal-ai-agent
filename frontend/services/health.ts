import { api } from "./api";

export interface HealthResponse {
  status: string;
  agent: boolean;
  memory: boolean;
  scheduler: boolean;
}

export async function getHealth() {
  const { data } = await api.get<HealthResponse>("/health");
  return data;
}