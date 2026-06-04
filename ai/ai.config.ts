import { google } from "@ai-sdk/google";

export function getAgentModel() {
  const modelId = process.env.AGENT_MODEL || "gemini-2.5-pro";

  return google(modelId);
}

