# AI Software Architect

A production-ready system design generator built with Next.js 14, Tailwind CSS, Shadcn UI, and the Gemini 1.5 Flash API.

## Features

- **Natural Language Prompting:** Describe your app idea, and let the AI generate the architecture.
- **Visual Diagrams:** Automatically renders Mermaid.js architecture diagrams and database schemas.
- **Comprehensive Output:** Generates architecture explanations, tech stack recommendations, API endpoints, and folder structures.
- **History:** Saves your past generated prompts locally (and via Supabase).
- **Export:** Easily copy JSON or Markdown outputs to clipboard.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **AI:** Google Gemini API (gemini-1.5-flash)
- **Database:** Supabase (PostgreSQL)
- **Visualization:** Mermaid.js
- **Icons:** Lucide React

## Getting Started

1. **Clone the repository** (if applicable) or download the files.

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and add your keys:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   \`\`\`

4. **Database & RAG Setup:**
   Run the SQL in \`supabase/migrations/001_create_architecture_patterns.sql\` in your Supabase SQL Editor to enable pgvector and create tables. Then run:
   \`\`\`bash
   npm run db:seed
   \`\`\`

5. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Deployment

For detailed instructions on how to deploy this application to Vercel, please refer to the [Vercel Deployment Guide](C:\Users\RAMAN\.gemini\antigravity\brain\f54f4bb6-6ffc-418e-8d76-fd50acac648a\deployment_guide.md).

## Design Decisions

- **UI/UX:** Used a dark mode default with modern gradients and animations to provide a premium feel (`class-variance-authority`, `tailwindcss-animate`).
- **State Handling:** Implemented local storage fallback mechanisms so the app functions even if Supabase is not fully configured by the end user right away.
- **AI Prompting:** Using strict JSON output from Gemini to cleanly parse and render individual components (diagrams, text, lists).

## License

MIT
