# 🇺🇸 AI Legal Advisor - US Startup Formation

AI-powered legal guidance for non-US founders setting up companies and raising capital in the United States.

## 🚀 Features

- **3 Interactive Layouts**
  - 📋 Founder Profile Input (citizenship, visa, business type, funding, timeline)
  - 🗺️ Personalized Legal Roadmap (adapts to your profile)
  - ⚠️ Dynamic Gap Analysis (blockers + solutions specific to YOU)

- **Real-Time Analysis**
  - Fill profile → Gap analysis updates instantly
  - Visa-based blockers (No visa vs F-1 vs H-1B = different issues)
  - Funding-based requirements (SEC Form D if raising > $0)
  - Business-type specific tasks (Fintech ≠ SaaS ≠ E-commerce)

- **AI-Powered Advisor**
  - Claude Haiku 4.5 (Anthropic's latest)
  - Context-aware: AI knows your profile
  - Vendor recommendations: Doola, Clerky, Deel, MainStreet, etc.
  - Official forms ONLY: IRS, Delaware, SEC (no fake docs)

- **Tech Stack**
  - Next.js 14 + TypeScript
  - Anthropic Claude API
  - TailwindCSS + Framer Motion
  - React state management (no DB needed)

## 🔧 Environment Variables

Required in Vercel:

```
ANTHROPIC_API_KEY=your_claude_api_key
```

## 📦 Installation

```bash
npm install
npm run dev
```

## 🌐 Deployment

Deploy to Vercel:
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy!

## 📄 License

MIT
