# How I Built This

A journal of building Open Alpha - an AI-powered K-12 learning platform.

---

## The Starting Point

We started with a repo that was documentation-only. Good architecture docs, a roadmap with Q1-Q4 2026 dates (which we removed to keep things date-agnostic), and placeholder package.json files. No actual code.

The plan was clear: build an MVP that's 100% powered by ATXP services so there's zero infrastructure cost. Users pay from their own ATXP wallet, and they get $10 free on signup - enough for many hours of learning.

---

## Why ATXP Everything?

This was the key architectural decision. Instead of spinning up our own Postgres, managing API keys for OpenAI/Anthropic, setting up file storage... we just use ATXP's MCP services for everything:

- **ATXP Database MCP** (`database.mcp.atxp.ai`) - PostgreSQL without the ops headache
- **ATXP LLM Gateway** (`llm.atxp.ai`) - Claude, GPT, Gemini through one OpenAI-compatible API
- **ATXP Filestore** - ready when we need avatars or uploads later

Single billing, single connection string, proven MCP patterns. The user's ATXP wallet covers all costs. We don't touch infrastructure.

---

## The Backend: Express + TypeScript

Went with Express because it's simple and the `@atxp/express` patterns are well-established. TypeScript for sanity.

**Services layer** (`backend/src/services/`):
- `atxp-db.ts` - Wraps the MCP SDK for database calls. `executeSql()` handles everything.
- `atxp-llm.ts` - Wraps the LLM Gateway with an OpenAI client. Has the tutor and coach system prompts baked in.
- `curriculum.ts` - The K-12 concept trees. This is just data, no AI - defines what concepts exist, their prerequisites, and grade levels.

**Routes** (`backend/src/routes/`):
- `auth.ts` - Signup/login with bcrypt + JWT. Nothing fancy, just works.
- `tutor.ts` - Student AI chat, quiz generation, quiz submission. The tutor prompt adapts to grade level.
- `coach.ts` - Parent AI chat. Different persona - supportive, practical, never does the kid's work.
- `progress.ts` - CRUD for mastery scores. Simple but important.
- `parent.ts` - The linking flow (invite codes) and read-only child progress viewing.

---

## The Curriculum Structure

This took some thought. We needed to support K-12 across Math, Reading, and Science without overcomplicating things.

Each concept has:
- `id` - like `math-fractions-intro`
- `name` - human readable
- `description` - what the AI tutor uses for context
- `prerequisites` - concept IDs that must be mastered first
- `gradeLevel` - 0 for Kindergarten, 1-12 for grades

The curriculum service has helpers like `getNextConcept()` that finds what a student should learn next based on their completed concepts and grade level.

We kept it simple - about 15-18 concepts per subject spanning K-12. Enough to demonstrate the system without being overwhelming.

---

## Mastery Model: 80% to Advance

Students don't just "complete" lessons - they demonstrate mastery. The flow:

1. Chat with AI tutor to learn the concept
2. When ready, take a 5-question quiz (AI-generated)
3. Score 80% or higher to mark the concept as mastered
4. Unlock concepts that had this as a prerequisite

We track highest score per concept (no regression). Attempts are counted so we can see if someone is struggling.

---

## Two AI Personas: Tutor vs Coach

This was important to get right.

**Student Tutor** is encouraging, uses age-appropriate language, celebrates wins, breaks things down when students struggle. The prompt includes grade level, current concept, and progress history so it can adapt.

**Parent Coach** is warm and practical, helps parents understand their child's learning journey, suggests home activities, but never does the child's work. It's a distinct experience - parents aren't learning math, they're learning how to support.

Both use the same LLM Gateway under the hood, just different system prompts.

---

## Parent-Child Linking

Parents and students have separate accounts. We link them via invite codes:

1. Student generates an 8-character code from their account
2. Parent enters the code in their dashboard
3. Link is established - parent can now view (read-only) child's progress

Parents can see what concepts are mastered, what's in progress, and session history (metadata only, not full chat logs - privacy matters).

---

## The Frontend: React + Vite

Standard modern React setup. Vite for fast dev experience. No component library - just custom CSS with CSS variables for theming.

Key pages:
- `Landing.tsx` - Marketing page, explains the product
- `Login.tsx` - Handles both student and parent auth, with grade picker for students
- `StudentDashboard.tsx` - Subject cards with progress bars
- `Learn.tsx` - The main learning interface with concept sidebar + chat
- `ParentDashboard.tsx` - Child linking + progress viewing
- `ParentCoach.tsx` - Chat interface for parent support

Shared components:
- `Chat.tsx` - Reusable chat UI (used by both tutor and coach)
- `Quiz.tsx` - The mastery checkpoint experience
- `Progress.tsx` - Various progress visualization components

---

## Auth: Keep It Simple

JWT tokens with 7-day expiry. Passwords hashed with bcrypt (10 rounds). Token stored in localStorage, sent via Authorization header.

The auth context in React handles loading the user on page load, provides `login()` and `logout()` functions, and wraps everything in a `ProtectedRoute` component for role-based access.

No OAuth, no magic links, no complexity. Email + password works fine for MVP.

---

## What We Deferred

The plan explicitly listed things to skip for MVP:
- Multi-provider AI configuration UI
- Native mobile apps (responsive web is enough)
- LMS integrations
- Offline mode
- Voice interface
- Advanced analytics

These live in ROADMAP.md as future phases. The MVP is intentionally focused.

---

## File Structure

```
open-alpha/
├── backend/
│   ├── src/
│   │   ├── server.ts           # Express entry point
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # ATXP integrations + curriculum
│   │   └── scripts/            # setup-db.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Routing + auth context
│   │   ├── pages/              # Route components
│   │   └── components/         # Shared UI
│   └── package.json
├── docs/
│   └── ARCHITECTURE.md         # Technical deep-dive
├── README.md                   # Setup + overview
├── ROADMAP.md                  # Development phases
└── package.json                # Monorepo root
```

---

## Running It

```bash
npm install                     # Install all dependencies
cp backend/.env.example backend/.env  # Add your ATXP connection string
npm run db:setup                # Create database + schema
npm run dev                     # Start both frontend and backend
```

Frontend runs on :3000, backend on :3001. Vite proxies `/api` to the backend.

---

## What's Next

The MVP is complete. A student can:
1. Sign up, pick their grade
2. Choose Math, Reading, or Science
3. Chat with an AI tutor
4. Take quizzes to prove mastery
5. See their progress

A parent can:
1. Sign up as parent
2. Link to their child via invite code
3. View child's progress (read-only)
4. Chat with an AI coach for support

Everything runs on ATXP services with zero infrastructure cost.

---

*Built with Claude Code, January 2026*
