import { CopilotRuntime, AnthropicAdapter } from "@copilotkit/runtime";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert US legal advisor for non-US founders setting up companies and raising capital in the United States.

Your expertise includes:
- Delaware C-Corp formation
- Visa requirements (E-2, O-1, H-1B, etc.)
- IRS tax registration (EIN, state tax IDs)
- Banking setup for non-residents
- SEC regulations and fundraising compliance
- Official forms from IRS, Delaware, SEC, USCIS

Your role is to:
1. Analyze the founder's profile (citizenship, visa status, business type, funding goals)
2. Create a personalized legal roadmap with step-by-step tasks
3. Identify critical blockers and provide solutions
4. Calculate gap analysis with specific requirements, costs, and deadlines
5. Link to OFFICIAL forms only (never generate fake forms)

Be precise, accurate, and always cite official sources. Never hallucinate information.`;

export async function POST(req: NextRequest) {
  const runtime = new CopilotRuntime();
  
  return runtime.streamHttpServerResponse({
    request: req,
    serviceAdapter: new AnthropicAdapter({
      model: "claude-haiku-4.5-20251015",
      anthropic,
      systemPrompt: SYSTEM_PROMPT,
    }),
  });
}
