# US Civics Prep - Flashcard Study Application

## Overview

This is a US Civics Test preparation application built as a full-stack TypeScript project. It provides a flashcard-based learning system with spaced repetition (SM-2 algorithm) to help users study the 100 civics questions for US citizenship. The app features a Duolingo-inspired gamified interface with progress tracking, streak counting, and multiple study modes (ordered, random, weak spots review).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for card flips and transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a pages-based structure:
- `Home.tsx` - Dashboard with mastery progress, streak counter, and study mode selection
- `StudySession.tsx` - Main flashcard study interface with SM-2 algorithm integration
- `QuestionsList.tsx` - Browse all 100 civics questions
- `VocabularyList.tsx` - Aggregated vocabulary from all questions with TTS

### Backend Architecture
- **Framework**: Express.js 5 with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: REST endpoints under `/api/*` prefix
- **Schema Validation**: Zod for input/output validation

Key API endpoints:
- `GET /api/study/session` - Fetches study cards (supports `mode=random`, `mode=hard`, `startId` params)
- `POST /api/study/review` - Submits card review with quality rating (0-5)
- `GET /api/study/stats` - Returns mastery stats, streak count, and weak item count
- `POST /api/seed` - Seeds database with 100 civics questions from `civics_data.ts`

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema**: Two main tables:
  - `questions` - Stores question, answer, translation, category, and keywords (JSON string)
  - `userProgress` - Tracks SM-2 algorithm fields (interval, easeFactor, reviewCount, nextReviewDate)

### Spaced Repetition Algorithm
The app implements the SM-2 algorithm for intelligent review scheduling:
- Quality ratings 0-5 map to Hard (1), Good (3), Easy (5) buttons
- Ease factor adjusts based on performance (minimum 1.3)
- Review intervals increase with successful recalls

### Build System
- Development: `tsx` for running TypeScript directly
- Production: Custom build script using Vite for frontend and esbuild for backend
- Output: Single `dist/` folder with `index.cjs` server and `public/` static assets

## External Dependencies

### Database
- **PostgreSQL**: Required, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Used for schema migrations (`npm run db:push`)

### UI Component Library
- **shadcn/ui**: Pre-built accessible components (configured via `components.json`)
- **Radix UI**: Underlying primitives for shadcn components

### Key Runtime Dependencies
- `express` - HTTP server
- `drizzle-orm` + `pg` - Database access
- `@tanstack/react-query` - Data fetching and caching
- `framer-motion` - Animations
- `date-fns` - Date calculations for spaced repetition

### Development Tools
- `vite` - Frontend dev server and bundler
- `tsx` - TypeScript execution
- `drizzle-kit` - Database migrations
- Replit plugins for development overlays and error handling