# Open Alpha

An AI-powered K-12 learning platform that provides personalized tutoring for students and coaching for parents.

## Overview

Open Alpha uses ATXP services to deliver adaptive learning experiences:

- **Student AI Tutor**: Conversational learning with AI that adapts to each student's grade level
- **Mastery-Based Progression**: Students advance by demonstrating understanding (80% on checkpoints)
- **Parent AI Coach**: Separate AI assistant to help parents support their child's learning
- **Progress Tracking**: Visual dashboards for both students and parents

## Subjects

- Mathematics (K-12)
- Reading & Language Arts (K-12)
- Science (K-12)

## Tech Stack

Built entirely on ATXP services for zero infrastructure cost:

| Service | Purpose |
|---------|---------|
| ATXP Database MCP | PostgreSQL for user data and progress |
| ATXP LLM Gateway | AI tutoring and coaching (Claude, GPT, Gemini) |
| ATXP Filestore | Asset storage (if needed) |

**Cost Model**: Users pay from their own ATXP wallet ($10 free credit on signup)

## Getting Started

### Prerequisites

- Node.js 18+
- An ATXP account ([atxp.ai](https://atxp.ai))
- Your ATXP connection string

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/open-alpha.git
cd open-alpha

# Install dependencies
npm install

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your ATXP_CONNECTION_STRING

# Initialize database
npm run db:setup

# Start development servers
npm run dev
```

### Environment Variables

```
ATXP_CONNECTION_STRING=your-connection-string-here
JWT_SECRET=your-jwt-secret
```

## Project Structure

```
open-alpha/
├── backend/               # Express.js API server
│   ├── server.ts         # Entry point
│   ├── routes/           # API endpoints
│   └── services/         # ATXP integrations
├── frontend/             # React application
│   ├── src/
│   │   ├── pages/        # Route components
│   │   └── components/   # Shared UI
└── package.json          # Monorepo root
```

## Features

### For Students

1. **Create Account** - Sign up with email, select grade level
2. **Choose Subject** - Pick Math, Reading, or Science
3. **Learn with AI** - Chat with an AI tutor that explains concepts
4. **Practice** - AI generates problems and checks answers
5. **Master Concepts** - Pass checkpoints to advance

### For Parents

1. **Create Account** - Sign up as a parent
2. **Link to Child** - Connect to your student's account
3. **View Progress** - See completed lessons and mastery scores (read-only)
4. **Get Coaching** - Chat with AI about supporting your child's learning

## Development

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run both
npm run dev
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for development phases.

## License

MIT
