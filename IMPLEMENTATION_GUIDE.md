# Resume Tailor MVP - Implementation Guide

## Overview

This document tracks the implementation progress for the Resume Tailor MVP based on the PRD in `scripts/PRD.txt`. The project creates an AI-powered tool to tailor resumes to job descriptions and generate cover letters.

## Current Progress

### ✅ Completed

1. **Project Setup**
   - Created feature branch: `feat/mvp-resume-tailor`
   - Set up git worktree at `.worktrees/mvp-resume-tailor`
   - Updated `package.json` with all dependencies
   - Installed core libraries:
     - Prisma & @prisma/client for database
     - React Hook Form & Zod for forms
     - OpenAI SDK for AI features
     - @react-pdf/renderer for PDF export
     - Radix UI components for UI
     - date-fns, zustand, and utilities

2. **Database Schema**
   - Created `prisma/schema.prisma` with models:
     - `User` - User authentication
     - `Resume` - Structured resume storage (JSON)
     - `JobDescription` - Job posting details
     - `Application` - Links resume + JD with tailored content
   - Created Prisma client wrapper at `src/lib/prisma.ts`
   - Created seed file at `prisma/seed.ts` with sample data

3. **Type System**
   - TypeScript types in `src/lib/types/resume.ts`
   - Zod validation schemas in `src/lib/schemas/resume.ts`
   - Full type safety for resume data, job descriptions, and API requests

4. **Environment Configuration**
   - Created `.env.example` with required variables
   - Documented all environment setup requirements

### 🚧 In Progress / Next Steps

The foundation is complete. Here's the recommended implementation order:

#### Phase 1: Core UI Components (2-3 days)

1. **Set up shadcn/ui**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button input textarea label select dialog card
   ```

2. **Create ATS-Safe Resume Template** (`src/components/resume/templates/ClassicTemplate.tsx`)
   - Single-column layout
   - Tailwind CSS styling
   - Matches design from screenshots
   - See Issue #7 for detailed specs

3. **Build Resume Preview Component** (`src/components/resume/ResumePreview.tsx`)
   - Uses ClassicTemplate
   - Real-time updates
   - Print-ready styling

#### Phase 2: Resume Builder (3-4 days)

4. **Contact Info Form** (`src/components/resume/ContactInfoForm.tsx`)
   - React Hook Form + Zod validation
   - Email, phone, location fields

5. **Professional Summary Form** (`src/components/resume/SummaryForm.tsx`)
   - Textarea with character counter
   - 50-500 character limit

6. **Experience Form Modal** (`src/components/resume/ExperienceForm.tsx`)
   - Matches screenshot design
   - Title, company, dates, location
   - Multiple bullet points
   - Add/edit/delete entries

7. **Education Form** (`src/components/resume/EducationForm.tsx`)
   - School, degree, dates
   - Multiple entries supported

8. **Skills Input** (`src/components/resume/SkillsForm.tsx`)
   - Comma-separated input
   - Converts to chips/tags

9. **Main Resume Builder Page** (`src/app/resume/builder/page.tsx`)
   - Combines all form sections
   - Side-by-side preview
   - Save draft functionality

#### Phase 3: Job Description Input (1-2 days)

10. **Job Description Form** (`src/app/resume/job-description/page.tsx`)
    - Large textarea for JD
    - Optional company name, role title, website
    - Smart extraction of metadata
    - Save to database

#### Phase 4: AI Integration (3-4 days)

11. **AI Tailoring Prompts** (`src/lib/prompts/tailoringPrompt.ts`)
    - System prompt for resume tailoring
    - Prompt template builder
    - Follows PRD guidelines

12. **Tailoring API Endpoint** (`src/app/api/tailor/route.ts`)
    - POST endpoint
    - Fetches resume + JD from database
    - Calls OpenAI GPT-4o-mini
    - Returns tailored resume JSON
    - Saves to Application table

13. **Tailoring UI** (`src/components/resume/TailoringInterface.tsx`)
    - Trigger tailoring process
    - Show loading state
    - Display before/after comparison
    - Allow regeneration

14. **Cover Letter Prompts** (`src/lib/prompts/coverLetterPrompt.ts`)
    - System prompt for cover letters
    - Template with tone variations

15. **Cover Letter API** (`src/app/api/cover-letter/route.ts`)
    - POST endpoint
    - Generates 150-250 word letters
    - Tone selection (professional/enthusiastic/concise)

16. **Cover Letter UI** (`src/components/cover-letter/CoverLetterGenerator.tsx`)
    - Generate button
    - Editable textarea
    - Regenerate option

#### Phase 5: PDF Export (2-3 days)

17. **React-PDF Components** (`src/components/pdf/ResumePDF.tsx`)
    - PDF version of ClassicTemplate
    - ATS-safe styling
    - Matches web preview

18. **PDF Generation** (`src/lib/pdf/generateResumePDF.ts`)
    - Uses @react-pdf/renderer
    - Returns blob for download

19. **Export API** (`src/app/api/export/resume/route.ts`)
    - POST endpoint
    - Generates PDF on demand
    - Returns file for download

20. **Download Button** (`src/components/resume/DownloadResumeButton.tsx`)
    - Triggers PDF generation
    - Shows loading state
    - Initiates browser download

#### Phase 6: Integration & Polish (2-3 days)

21. **Landing Page** (`src/app/page.tsx`)
    - Hero section
    - "Start Resume" CTA
    - Feature highlights
    - Matches PRD user flow

22. **Navigation Flow**
    - Landing → Resume Builder → JD Input → Tailor → Export
    - Progress indicator
    - Back/forward navigation

23. **State Management** (Zustand stores)
    - `src/hooks/useResumeStore.ts` - Draft resume state
    - `src/hooks/useApplicationStore.ts` - Current application
    - localStorage persistence

24. **Error Handling**
    - API error boundaries
    - Form validation feedback
    - User-friendly error messages

25. **Testing**
    - Test full user workflow
    - Verify ATS compatibility (Jobscan.co)
    - Mobile responsiveness check
    - Cross-browser testing

## Database Setup

Before running the app, set up your database:

1. **Install PostgreSQL** (or use Neon/Supabase)
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Create database
   createdb resumetailor
   ```

2. **Set environment variable**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your DATABASE_URL
   ```

3. **Run migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Seed database**
   ```bash
   npm run db:seed
   ```

5. **Open Prisma Studio** (optional)
   ```bash
   npm run db:studio
   ```

## OpenAI Setup

1. Get API key from https://platform.openai.com/
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY="sk-..."
   ```

## Running the App

```bash
npm run dev
```

Visit http://localhost:3000

## GitHub Issues Reference

All detailed specifications are in the GitHub issues created:

- **Issue #1**: Database Schema & Prisma Setup ✅
- **Issue #2**: Resume Builder UI
- **Issue #3**: Job Description Input Interface
- **Issue #4**: AI Resume Tailoring Integration
- **Issue #5**: Cover Letter Generation
- **Issue #6**: PDF Export Functionality
- **Issue #7**: ATS-Safe Template Design
- **Issue #8**: Project Dependencies & Environment Setup ✅
- **Issue #9**: Optional - Authentication (defer to post-MVP)

## Estimated Timeline

- **Foundation**: ✅ Complete
- **Phase 1-2**: 5-7 days
- **Phase 3-4**: 4-6 days
- **Phase 5-6**: 4-5 days

**Total MVP**: 2-3 weeks with one developer

## Design Reference

- Screenshots: `scripts/Screenshot 2025-10-22 at 10.50.00 AM.png` & `10.50.04 AM.png`
- PRD: `scripts/PRD.txt`
- CLAUDE.md: Project-specific conventions and commands

## Key Commands

```bash
# Development
npm run dev

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed with sample data

# Build
npm run build

# Lint
npm run lint
```

## Notes

- Prioritize ATS compatibility over visual flair
- Keep it simple - avoid over-engineering
- Test with real job descriptions early
- Use Jobscan.co to verify ATS parsing
- Mobile responsiveness is important
- Consider adding analytics once core features work

## Success Metrics (from PRD)

- Time from JD paste → tailored resume: <2 minutes
- ATS parsing accuracy: >90%
- User satisfaction on AI tailoring: >70%

---

**Current Status**: Foundation complete, ready for UI development
**Last Updated**: 2025-10-22
