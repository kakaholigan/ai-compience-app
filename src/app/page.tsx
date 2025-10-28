"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [profile, setProfile] = useState({
    citizenship: "",
    visa: "",
    businessType: "",
    funding: "",
    timeline: ""
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate analysis when profile changes
  useEffect(() => {
    if (profile.citizenship || profile.visa || profile.businessType) {
      const blockers = [];
      const requirements = [];
      
      // Visa blockers
      if (profile.visa === 'None' || !profile.visa) {
        blockers.push({
          type: 'critical',
          title: 'No US Visa',
          desc: 'Cannot be company director',
          solutions: ['Hire US citizen director', 'Apply E-2 visa ($100k)', 'Nominee director service']
        });
      }
      
      if (profile.visa === 'F-1 Student') {
        blockers.push({
          type: 'high',
          title: 'F-1 Work Restrictions',
          desc: 'Limited to CPT/OPT only',
          solutions: ['Find H-1B co-founder', 'Transition to E-2', 'Stay as passive investor']
        });
      }

      // Always required
      requirements.push(
        { title: 'Registered Agent (Delaware)', cost: '$125-300/yr', deadline: 'Before incorporation' },
        { title: 'IRS EIN Application', cost: 'Free', deadline: '7 days after incorporation' },
        { title: 'Delaware Annual Tax', cost: '$450/yr', deadline: 'March 1st' }
      );

      // Funding-based
      if (parseInt(profile.funding) > 1000000) {
        requirements.push({
          title: 'SEC Form D (Reg D)',
          cost: '$1,500-3,000',
          deadline: '15 days after first sale'
        });
      } else if (parseInt(profile.funding) > 0) {
        requirements.push({
          title: 'SEC Form D (Reg D)',
          cost: '$0-500',
          deadline: '15 days after first sale'
        });
      }

      // Business type specific
      if (profile.businessType === 'E-commerce') {
        requirements.push({
          title: 'Sales Tax Registration',
          cost: 'Varies by state',
          deadline: 'Before first sale'
        });
      }

      setAnalysis({ blockers, requirements });
      generateRoadmap();
    }
  }, [profile]);

  // Generate personalized roadmap
  const generateRoadmap = () => {
    const tasks = ['Company Formation', 'Banking Setup', 'Tax Registration'];
    
    if (parseInt(profile.funding) > 0) {
      tasks.push('Fundraising Prep');
    }
    
    if (profile.visa === 'None') {
      tasks.unshift('Visa/Director Resolution');
    }
    
    setRoadmap(tasks);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilotkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          profile: profile
        }),
      });
      
      const data = await response.json();
      setMessages([...messages, userMessage, { role: "assistant", content: data.content[0].text }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 3 Interactive Layouts */}
        <div className="flex-1 grid grid-rows-3 gap-4 p-6">
          {/* Layout 1: Profile Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Founder Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-white/80 text-sm">Citizenship</label>
                <input 
                  type="text" 
                  placeholder="e.g., Vietnam, India, China"
                  value={profile.citizenship}
                  onChange={(e) => setProfile({...profile, citizenship: e.target.value})}
                  className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 text-sm">Visa Status</label>
                  <select 
                    value={profile.visa}
                    onChange={(e) => setProfile({...profile, visa: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="F-1 Student">F-1 Student</option>
                    <option value="H-1B Work">H-1B Work</option>
                    <option value="E-2 Investor">E-2 Investor</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/80 text-sm">Business Type</label>
                  <select
                    value={profile.businessType}
                    onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Select</option>
                    <option value="SaaS">SaaS</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 text-sm">Funding Target ($)</label>
                  <input
                    type="number"
                    placeholder="500000"
                    value={profile.funding}
                    onChange={(e) => setProfile({...profile, funding: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm">Timeline (months)</label>
                  <input
                    type="number"
                    placeholder="6"
                    value={profile.timeline}
                    onChange={(e) => setProfile({...profile, timeline: e.target.value})}
                    className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Layout 2: Legal Roadmap */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🗺️ Legal Roadmap</h2>
            {roadmap.length > 0 ? (
              <div className="space-y-3">
                {roadmap.map((phase, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{phase}</p>
                      <p className="text-white/60 text-xs">Status: Pending</p>
                    </div>
                    <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{width: `${(i + 1) * 20}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">Fill out your profile to see personalized roadmap</p>
            )}
          </div>

          {/* Layout 3: Gap Analysis */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⚠️ Gap Analysis</h2>
            {analysis ? (
              <div className="space-y-3">
                {analysis.blockers?.length > 0 && analysis.blockers.map((blocker: any, i: number) => (
                  <div key={i} className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <h3 className="text-red-300 font-bold mb-2">🚫 {blocker.title}</h3>
                    <p className="text-white/90 text-sm">{blocker.desc}</p>
                    <div className="mt-2 space-y-1">
                      {blocker.solutions.map((sol: string, j: number) => (
                        <p key={j} className="text-white/70 text-xs">• {sol}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {analysis.requirements?.length > 0 && (
                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <h3 className="text-blue-300 font-bold mb-2">📋 Requirements</h3>
                    {analysis.requirements.map((req: any, i: number) => (
                      <div key={i} className="text-white/90 text-sm mb-2">
                        <p className="font-medium">{req.title}</p>
                        <p className="text-white/70 text-xs">Cost: {req.cost} | Deadline: {req.deadline}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/60 text-sm">Fill out your profile to see gap analysis</p>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 flex flex-col">
          <div className="p-4 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">🇺🇸 US Legal Advisor</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-white/60 text-sm">Hi! I'm your AI legal advisor. Tell me about your startup plans and I'll create a personalized roadmap for you.</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-500/20 ml-8' : 'bg-white/10 mr-8'}`}>
                <p className="text-white text-sm">{msg.content}</p>
              </div>
            ))}
            {loading && <p className="text-white/60 text-sm">Thinking...</p>}
          </div>

          <div className="p-4 border-t border-white/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about company formation, visas, fundraising..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
  );
}
