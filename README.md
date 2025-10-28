# 🇺🇸 AI Legal Advisor - US Startup Formation

AI-powered legal guidance for non-US founders setting up companies and raising capital in the United States.

## 🚀 Features

- **3 Interactive Layouts**
  - 📋 Founder Profile Input
  - 🗺️ Personalized Legal Roadmap
  - ⚠️ Gap Analysis with Blockers & Solutions

- **AI-Powered Advisor**
  - Claude Haiku 4.5 (latest model)
  - Official forms integration (IRS, Delaware, SEC)
  - Real-time gap analysis

- **Tech Stack**
  - Next.js 14 + TypeScript
  - CopilotKit (Agent UI framework)
  - Neon PostgreSQL
  - Zep Memory + Context
  - Pinecone Vector DB

## 🔧 Environment Variables

Required in Vercel:

```
ANTHROPIC_API_KEY=your_claude_api_key
ZEP_API_KEY=your_zep_api_key
ZEP_PROJECT_ID=your_zep_project_id
DATABASE_URL=your_neon_postgres_url
PERPLEXITY_API_KEY=your_perplexity_key
PINECONE_API_KEY=your_pinecone_key
NEXT_PUBLIC_APP_URL=your_vercel_url
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
