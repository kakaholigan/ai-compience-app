"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, AlertCircle, CheckCircle2, Globe2, Briefcase, DollarSign, Calendar, TrendingUp } from "lucide-react";

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
  const [progress, setProgress] = useState(0);

  // Calculate progress
  useEffect(() => {
    let p = 0;
    if (profile.citizenship) p += 20;
    if (profile.visa) p += 20;
    if (profile.businessType) p += 20;
    if (profile.funding) p += 20;
    if (profile.timeline) p += 20;
    setProgress(p);
  }, [profile]);

  // Generate analysis when profile changes
  useEffect(() => {
    if (profile.citizenship || profile.visa || profile.businessType) {
      const blockers = [];
      const requirements = [];
      
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

      requirements.push(
        { title: 'Registered Agent (Delaware)', cost: '$125-300/yr', deadline: 'Before incorporation' },
        { title: 'IRS EIN Application', cost: 'Free', deadline: '7 days after incorporation' },
        { title: 'Delaware Annual Tax', cost: '$450/yr', deadline: 'March 1st' }
      );

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

  const generateRoadmap = () => {
    const tasks = ['Company Formation', 'Banking Setup', 'Tax Registration'];
    if (parseInt(profile.funding) > 0) tasks.push('Fundraising Prep');
    if (profile.visa === 'None') tasks.unshift('Visa/Director Resolution');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl"
      >
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  AI Legal Advisor
                </h1>
                <p className="text-sm text-purple-300">US Startup Formation for Non-US Founders</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                Claude AI Online
              </div>
              <div className="px-5 py-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
                <div className="text-xs text-purple-300 mb-2 font-medium">Profile Completion</div>
                <div className="flex items-center gap-3">
                  <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white min-w-[3ch]">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex h-[calc(100vh-97px)]">
        {/* Left: 3 Layouts */}
        <div className="flex-1 grid grid-rows-3 gap-6 p-8 overflow-y-auto">
          
          {/* Layout 1: Profile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Globe2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Profile</h2>
                  <p className="text-xs text-purple-300">Tell us about your startup journey</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Globe2 className="w-3 h-3 text-purple-400" />
                    Citizenship
                  </label>
                  <input 
                    type="text" 
                    placeholder="Vietnam, India, China..."
                    value={profile.citizenship}
                    onChange={(e) => setProfile({...profile, citizenship: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:border-purple-500 focus:bg-white/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-purple-400" />
                    Visa Status
                  </label>
                  <select 
                    value={profile.visa}
                    onChange={(e) => setProfile({...profile, visa: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="F-1 Student">F-1 Student</option>
                    <option value="H-1B Work">H-1B Work</option>
                    <option value="E-2 Investor">E-2 Investor</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2 block">Business Type</label>
                  <select
                    value={profile.businessType}
                    onChange={(e) => setProfile({...profile, businessType: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="SaaS">SaaS</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Fintech">Fintech</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    Funding Target
                  </label>
                  <input
                    type="number"
                    placeholder="500000"
                    value={profile.funding}
                    onChange={(e) => setProfile({...profile, funding: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:border-purple-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    Timeline (months)
                  </label>
                  <input
                    type="number"
                    placeholder="6"
                    value={profile.timeline}
                    onChange={(e) => setProfile({...profile, timeline: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Layout 2: Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Legal Roadmap</h2>
                  <p className="text-xs text-purple-300">Your personalized path</p>
                </div>
              </div>
              
              {roadmap.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[calc(100%-80px)]">
                  {roadmap.map((phase, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{phase}</p>
                        <p className="text-purple-300 text-xs">Status: Pending</p>
                      </div>
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: `${(i + 1) * 20}%`}}></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-80px)] text-white/40 text-sm">
                  Fill your profile to see roadmap
                </div>
              )}
            </div>
          </motion.div>

          {/* Layout 3: Gap Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Gap Analysis</h2>
                  <p className="text-xs text-purple-300">Blockers & requirements</p>
                </div>
              </div>
              
              {analysis ? (
                <div className="space-y-3 overflow-y-auto max-h-[calc(100%-80px)]">
                  {analysis.blockers?.length > 0 && analysis.blockers.map((blocker: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-red-300 font-bold text-sm">{blocker.title}</h3>
                          <p className="text-white/80 text-xs mt-1">{blocker.desc}</p>
                        </div>
                      </div>
                      <div className="ml-6 space-y-1">
                        {blocker.solutions.map((sol: string, j: number) => (
                          <p key={j} className="text-white/60 text-xs flex items-start gap-1.5">
                            <span className="text-green-400">•</span>
                            {sol}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  {analysis.requirements?.length > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <h3 className="text-blue-300 font-bold text-sm mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Requirements
                      </h3>
                      {analysis.requirements.map((req: any, i: number) => (
                        <div key={i} className="text-white/90 text-xs mb-2 last:mb-0 pb-2 last:pb-0 border-b border-white/5 last:border-0">
                          <p className="font-semibold">{req.title}</p>
                          <p className="text-white/50 text-[10px] mt-1">
                            💰 {req.cost} • ⏰ {req.deadline}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-80px)] text-white/40 text-sm">
                  Fill your profile to see analysis
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Chat */}
        <div className="w-[480px] border-l border-white/10 flex flex-col bg-black/20 backdrop-blur-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Advisor</h2>
                <p className="text-xs text-purple-300">Claude Haiku 4.5</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-purple-200/70 text-sm space-y-3 bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <p className="font-semibold text-white">👋 Hi! I'm your AI legal advisor.</p>
                <p className="text-xs">I can help with:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Delaware C-Corp', 'Visa Requirements', 'SEC Compliance', 'Official Forms'].map(item => (
                    <div key={item} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/10 text-purple-100 border border-white/10'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about incorporation, visas, fundraising..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:border-purple-500 focus:bg-white/10 outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
