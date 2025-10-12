import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

// ✅ Use a secure environment variable (without NEXT_PUBLIC)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const copilotKit = new CopilotRuntime();

// ✅ Use your preferred model
const serviceAdapter = new GroqAdapter({
  // @ts-ignore
  groq,
  model: "mixtral-8x7b",
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
