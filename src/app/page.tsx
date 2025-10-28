import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <main className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 3 Interactive Layouts */}
        <div className="flex-1 grid grid-rows-3 gap-4 p-6">
          {/* Layout 1: Profile Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Founder Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm">Citizenship</label>
                <input 
                  type="text" 
                  placeholder="e.g., Vietnam, India, China"
                  className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/80 text-sm">Visa Status</label>
                  <select className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option>None</option>
                    <option>F-1 Student</option>
                    <option>H-1B Work</option>
                    <option>E-2 Investor</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/80 text-sm">Business Type</label>
                  <select className="w-full mt-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option>Tech Startup</option>
                    <option>SaaS</option>
                    <option>E-commerce</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Layout 2: Legal Roadmap */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🗺️ Legal Roadmap</h2>
            <div className="space-y-3">
              {['Company Formation', 'Banking Setup', 'Tax Registration', 'Fundraising Prep'].map((phase, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{phase}</p>
                    <p className="text-white/60 text-xs">Status: Pending</p>
                  </div>
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{width: `${i * 25}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layout 3: Gap Analysis */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⚠️ Gap Analysis</h2>
            <div className="space-y-3">
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <h3 className="text-red-300 font-bold mb-2">🚫 Critical Blocker</h3>
                <p className="text-white/90 text-sm">No US visa → Cannot be company director</p>
                <div className="mt-2 space-y-1">
                  <p className="text-white/70 text-xs">• Option A: Hire US citizen director</p>
                  <p className="text-white/70 text-xs">• Option B: Apply for E-2 visa ($100k investment)</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-300 font-bold mb-2">⚡ Required</h3>
                <p className="text-white/90 text-sm">Registered Agent needed before incorporation</p>
                <p className="text-white/70 text-xs mt-1">Cost: $125-300/year | Vendors: Doola, Northwest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="w-96">
          <CopilotChat
            labels={{
              title: "🇺🇸 US Legal Advisor",
              initial: "Hi! I'm your AI legal advisor. Tell me about your startup plans and I'll create a personalized roadmap for you.",
              placeholder: "Ask about company formation, visas, fundraising..."
            }}
            className="h-full"
          />
        </div>
      </main>
    </CopilotKit>
  );
}
