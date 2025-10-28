import {
  CopilotRuntime,
  AnthropicAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<Response> {
  const runtime = new CopilotRuntime();
  
  const serviceAdapter = new AnthropicAdapter({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-3-5-haiku-20241022",
  });

  return copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: req.url,
  });
}
