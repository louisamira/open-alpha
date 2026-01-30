# Open Alpha Architecture

## Overview

Open Alpha is an AI-powered K-12 learning platform built entirely on ATXP services for zero infrastructure cost. Students learn through personalized AI tutoring, while parents can monitor progress and receive coaching support.

## Tech Stack

### All ATXP Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **ATXP Database MCP** | PostgreSQL database for users, progress, sessions | MCP SDK via `database.mcp.atxp.ai` |
| **ATXP LLM Gateway** | AI tutoring and coaching | OpenAI-compatible API via `llm.atxp.ai` |
| **ATXP Filestore** | Asset storage (future) | MCP SDK via `filestore.mcp.atxp.ai` |

### Application Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Auth**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Landing  │ │  Login   │ │ Student  │ │  Parent  │            │
│  │   Page   │ │   Page   │ │Dashboard │ │Dashboard │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐             │
│  │  Learn   │ │  Quiz    │ │   Chat Component     │             │
│  │   Page   │ │Component │ │ (Tutor & Coach)      │             │
│  └──────────┘ └──────────┘ └──────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Express.js)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Routes                               │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │   │
│  │  │  auth  │ │ tutor  │ │ coach  │ │progress│ │ parent │  │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     Services                              │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │   │
│  │  │   atxp-db    │ │   atxp-llm   │ │    curriculum    │  │   │
│  │  │  (DB MCP)    │ │ (LLM Gateway)│ │ (K-12 concepts)  │  │   │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
┌───────────────────┐ ┌───────────────┐ ┌───────────────┐
│ ATXP Database MCP │ │ ATXP LLM      │ │ ATXP Filestore│
│ (PostgreSQL)      │ │ Gateway       │ │ (Future)      │
│                   │ │               │ │               │
│ database.mcp.     │ │ llm.atxp.ai   │ │ filestore.mcp.│
│ atxp.ai           │ │               │ │ atxp.ai       │
└───────────────────┘ └───────────────┘ └───────────────┘
```

## Database Schema

```sql
-- Users table (students and parents)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  grade_level INT,  -- K=0, 1-12 for grades
  created_at TIMESTAMP DEFAULT NOW()
);

-- Parent-child account linking
CREATE TABLE parent_links (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES users(id),
  student_id INT REFERENCES users(id),
  invite_code TEXT UNIQUE,  -- 8-char code for linking
  linked_at TIMESTAMP,      -- NULL until linked
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning progress tracking
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES users(id),
  subject TEXT NOT NULL,    -- 'math', 'reading', 'science'
  concept_id TEXT NOT NULL, -- e.g., 'math-fractions-intro'
  mastery_score INT DEFAULT 0,  -- 0-100, 80+ = mastered
  attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(student_id, subject, concept_id)
);

-- Chat sessions (tutor and coach)
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_type TEXT CHECK (session_type IN ('tutor', 'coach')),
  subject TEXT,
  concept_id TEXT,
  messages JSONB DEFAULT '[]',  -- Array of {role, content}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create new account |
| POST | `/login` | Authenticate user |
| GET | `/me` | Get current user |

### Student Tutor (`/api/tutor`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/concepts/:subject` | List concepts for subject |
| GET | `/next/:subject` | Get recommended next concept |
| POST | `/chat` | Send message to AI tutor |
| POST | `/quiz` | Generate quiz questions |
| POST | `/quiz/submit` | Submit quiz results |

### Parent Coach (`/api/coach`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/children` | List linked children |
| POST | `/chat` | Send message to AI coach |
| GET | `/sessions` | Get session history |

### Progress (`/api/progress`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all progress |
| GET | `/summary` | Get progress summary by subject |
| GET | `/:subject` | Get progress for subject |
| GET | `/activity/recent` | Get recent activity |

### Parent (`/api/parent`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate-invite` | Generate invite code (student) |
| POST | `/link` | Link to child using code |
| GET | `/children` | List linked children |
| GET | `/children/:id/progress` | View child's progress |
| GET | `/children/:id/sessions` | View child's session history |
| DELETE | `/children/:id` | Unlink from child |

## AI System Prompts

### Student Tutor

```
You are an encouraging AI tutor for a grade {grade_level} student
learning {subject}.

Current concept: {concept_name}
{concept_description}

Student's learning history: {progress_context}

Guidelines:
- Use age-appropriate language for grade {grade_level}
- Celebrate small wins and progress
- If struggling, break concepts into smaller steps
- Keep responses concise and engaging
- Use examples relevant to their age group
- Ask questions to check understanding
```

### Parent Coach

```
You are a supportive AI coach for parents of students using Open Alpha.

The parent's child is in grade {grade_level}.
Child's recent progress: {progress_summary}

Guidelines:
- Help the parent understand their child's learning journey
- Suggest practical ways to support learning at home
- Never do the child's work - focus on the parent's supportive role
- Be warm, encouraging, and practical
- Explain educational concepts in parent-friendly terms
```

## Curriculum Structure

The curriculum is organized by subject with concepts mapped to grade levels:

```typescript
interface Concept {
  id: string;           // e.g., 'math-fractions-intro'
  name: string;         // e.g., 'Introduction to Fractions'
  description: string;  // Brief explanation
  prerequisites: string[]; // Concept IDs that must be completed first
  gradeLevel: number;   // K=0, 1-12 for grades
}
```

### Subjects

1. **Mathematics** (K-12)
   - Counting → Addition/Subtraction → Multiplication/Division
   - Fractions → Decimals → Algebra → Geometry → Calculus prep

2. **Reading & Language Arts** (K-12)
   - Phonics → Fluency → Comprehension
   - Vocabulary → Analysis → Critical Reading

3. **Science** (K-12)
   - Senses → Living Things → Weather
   - Life Cycles → Matter → Energy → Biology/Chemistry/Physics

## Mastery Model

- Students must score **80% or higher** on a concept quiz to "master" it
- Progress is tracked per-concept, per-subject
- Higher scores are preserved (no regression)
- Prerequisites must be mastered before advancing

## Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management (7-day expiry)
- Parent accounts have read-only access to child data
- Invite codes are one-time use and expire on link
- All ATXP calls authenticated via connection string

## Cost Model

- **Infrastructure**: $0 (all ATXP services)
- **User costs**: Deducted from user's ATXP wallet
- **Free tier**: $10 credit on ATXP signup (covers many hours of learning)
