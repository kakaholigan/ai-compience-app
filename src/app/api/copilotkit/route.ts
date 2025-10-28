import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

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
  try {
    const { messages } = await req.json();
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
