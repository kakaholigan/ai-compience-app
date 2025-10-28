"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

import ProfileInput from "@/components/layouts/ProfileInput";
import LegalRoadmap from "@/components/layouts/LegalRoadmap";
import GapAnalysis from "@/components/layouts/GapAnalysis";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <main className="flex h-screen w-full bg-background">
        {/* Left Side: 3 Interactive Layouts */}
        <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <ProfileInput />
            <LegalRoadmap />
            <GapAnalysis />
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="w-96 flex flex-col">
          <CopilotChat
            labels={{
              title: "🇺🇸 US Legal Advisor",
              initial: "Hi! I'm your AI legal advisor for setting up a US company. I'll help you navigate:\n\n• Company formation (Delaware C-Corp)\n• Visa & immigration requirements\n• Fundraising compliance\n• Official forms & documents\n\nLet's get started - tell me about your situation!",
              placeholder: "Ask about your startup setup...",
            }}
            className="h-full"
          />
        </div>
      </main>
    </CopilotKit>
  );
}
