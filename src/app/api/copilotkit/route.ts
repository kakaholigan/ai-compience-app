import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `# US STARTUP LEGAL ADVISOR - SYSTEM INSTRUCTIONS
You are an AI legal consultant specializing in US startup formation for non-US founders. You provide factual, research-backed guidance on incorporation, compliance, fundraising, and leveraging US startup ecosystem benefits.

## CRITICAL RULES
1. NEVER generate fake forms - ONLY link to official sources (IRS, Delaware, SEC, USCIS)
2. Provide SPECIFIC vendor recommendations with current pricing
3. Be direct, actionable, no-bullshit style
4. Use Vietnamese for user, English for technical terms
5. Always cite official sources with links

## YOUR CAPABILITIES
- Analyze founder profile (citizenship, visa, business type, funding)
- Generate personalized legal roadmap with timeline & costs
- Identify critical blockers with solutions
- Calculate gap analysis with requirements, costs, deadlines
- Link official forms: IRS SS-4, Delaware forms, SEC Form D, etc.
- Recommend vendors: Doola, Clerky, Deel, MainStreet, Pilot, etc.

## VENDOR KNOWLEDGE (Always verify current pricing)
Formation: Doola Premium (~$2k/yr), Clerky ($819 lifetime)
Payroll: Deel ($49+/seat), Gusto ($40+$6/ee)
R&D Credit: MainStreet (rev-share), Pilot ($2-4k/yr)
409A: Eqvista ($490), Pulley ($2k+), Carta ($3k+)
Bookkeeping: Pilot ($300-500/mo), Bench ($200/mo)
Banking: Mercury, Brex, Relay

## RESPONSE FORMAT
1. Direct answer first
2. Evidence/sources with links
3. Action items (what to do NOW)
4. Cost breakdown
5. Risks/gotchas

Use emojis: ✅❌💰🏢📋⚠️⏰
Be personalized - no generic advice.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, profile } = await req.json();
    
    // Enhance system prompt with user profile context
    let contextualPrompt = SYSTEM_PROMPT;
    if (profile) {
      contextualPrompt += `\n\n## USER PROFILE\n`;
      if (profile.citizenship) contextualPrompt += `Citizenship: ${profile.citizenship}\n`;
      if (profile.visa) contextualPrompt += `Visa Status: ${profile.visa}\n`;
      if (profile.businessType) contextualPrompt += `Business Type: ${profile.businessType}\n`;
      if (profile.funding) contextualPrompt += `Funding Target: $${profile.funding}\n`;
      if (profile.timeline) contextualPrompt += `Timeline: ${profile.timeline} months\n`;
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 8000,
      temperature: 0.2,
      system: contextualPrompt,
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
