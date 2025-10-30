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
<<<<<<< HEAD
  model: "llama-3.1-8b-instant",
=======
  model: "mixtral-8x7b",
>>>>>>> bd512485cc0183b296cd1775e26abebfa2ff2e8f
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
