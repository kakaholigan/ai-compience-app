"use client";

import { useState } from "react";
import ProfileInput from "@/components/layouts/ProfileInput";
import LegalRoadmap from "@/components/layouts/LegalRoadmap";
import GapAnalysis from "@/components/layouts/GapAnalysis";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.content?.[0]?.text || "Sorry, I couldn't process that request."
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, there was an error processing your request."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side: 3 Interactive Layouts */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ProfileInput />
          <LegalRoadmap />
          <GapAnalysis />
        </div>
      </div>

      {/* Right Side: Chat Interface */}
      <div className="w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 flex flex-col">
        <div className="p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">🇺🇸 US Legal Advisor</h2>
          <p className="text-xs text-white/60 mt-1">AI-powered guidance for non-US founders</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-white/60 text-sm space-y-2">
              <p>Hi! I'm your AI legal advisor for setting up a US company.</p>
              <p>I'll help you navigate:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Company formation (Delaware C-Corp)</li>
                <li>Visa & immigration requirements</li>
                <li>Fundraising compliance</li>
                <li>Official forms & documents</li>
              </ul>
              <p className="mt-2">Let's get started - tell me about your situation!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-purple-500/20 ml-8'
                  : 'bg-white/10 mr-8'
              }`}
            >
              <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="text-white/60 text-sm">
              <span className="animate-pulse">AI is thinking...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about your startup setup..."
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
