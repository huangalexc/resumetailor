# Resume Tailor MVP

AI-powered resume tailoring and cover letter generation tool using OpenAI GPT-4o-mini.

## Features

- **Resume Builder**: Interactive 5-step form to create structured resumes
- **Job Description Analysis**: Smart metadata extraction from job postings
- **AI Tailoring**: Automatic resume optimization for specific job applications
- **Match Score**: 0-100% compatibility score with detailed feedback
- **ATS Optimization**: Keywords and formatting optimized for Applicant Tracking Systems
- **Cover Letter Generation**: Personalized cover letters for each application
- **PDF Export**: ATS-compatible PDF downloads with smart filenames
- **Before/After Comparison**: Visual comparison of original vs. tailored resumes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **AI**: OpenAI GPT-4o-mini
- **PDF**: @react-pdf/renderer
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand with localStorage persistence
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)

## Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm or yarn
- OpenAI API key

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd resumetailor

# Navigate to MVP worktree
cd .worktrees/mvp-resume-tailor

# Install dependencies
npm install
```

### 2. Environment Variables

Create `.env.local` file in the project root:

```bash
# OpenAI API Key (Required)
OPENAI_API_KEY=sk-...

# Optional: Database (Future feature)
# DATABASE_URL=postgresql://...
```

**Getting an OpenAI API Key:**
1. Visit https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. Add payment method (required for API access)

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Complete Workflow

**Step 1: Build Your Resume**
1. Visit homepage and click "Start Building Resume"
2. Fill in 5 sections:
   - Contact Information (name, email, phone, location)
   - Professional Summary (50-500 characters)
   - Work Experience (titles, companies, dates, bullets)
   - Education (degrees, schools, dates)
   - Skills (comma-separated list)
3. See live preview as you type
4. Option: Download PDF of base resume

**Step 2: Add Job Description**
1. Click "Tailor to Job →" after completing resume
2. Paste full job posting (100-10,000 characters)
3. AI auto-extracts:
   - Company name
   - Job title
4. Review and edit if needed
5. Click "Continue to Tailor Resume"

**Step 3: AI Tailoring**
1. AI automatically analyzes job description
2. Wait 10-30 seconds for processing
3. Review results:
   - Match score (0-100%)
   - Key changes made
   - ATS keywords added
4. Toggle between tailored version and before/after comparison

**Step 4: Generate Cover Letter (Optional)**
1. Click "Generate Cover Letter"
2. Wait 10-20 seconds
3. Review personalized letter (250-400 words)
4. Copy text for your application

**Step 5: Download PDF**
1. Click "Download Tailored Resume"
2. PDF downloads as: `YourName_CompanyName_Resume.pdf`
3. File is ATS-optimized and ready to submit

### Tips for Best Results

**Job Descriptions:**
- Include complete posting (not just summary)
- Keep original formatting
- Include requirements, responsibilities, company info
- More detail = better tailoring

**Resume Content:**
- Use specific achievements with numbers
- Include relevant technologies and skills
- Write clear, concise bullet points
- Focus on impact and results

**ATS Optimization:**
- Downloaded PDFs use single-column layout
- Standard fonts (Times-Roman)
- No images or graphics
- Simple, clean formatting

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── tailor/route.ts          # Resume tailoring endpoint
│   │   └── cover-letter/route.ts    # Cover letter generation
│   ├── job-description/
│   │   └── page.tsx                 # Job description input
│   ├── resume/
│   │   ├── builder/page.tsx         # 5-step resume builder
│   │   └── tailor/page.tsx          # AI tailoring results
│   └── page.tsx                     # Landing page
├── components/
│   ├── resume/
│   │   ├── forms/                   # Builder form components
│   │   └── templates/
│   │       ├── ClassicTemplate.tsx  # Web preview
│   │       └── ClassicPdfTemplate.tsx # PDF export
│   ├── ui/                          # shadcn/ui components
│   ├── ErrorBoundary.tsx            # Error handling
│   └── LoadingSpinner.tsx           # Loading states
├── hooks/
│   ├── useResumeStore.ts            # Resume state management
│   └── useApplicationStore.ts       # Application state
├── lib/
│   ├── helpers/
│   │   └── extractJobMetadata.ts    # JD parsing
│   ├── prompts/
│   │   └── tailoringPrompt.ts       # AI prompts
│   ├── schemas/
│   │   └── resume.ts                # Zod validation
│   ├── types/
│   │   └── resume.ts                # TypeScript types
│   └── utils/
│       ├── pdfGenerator.ts          # PDF generation
│       └── utils.ts                 # Helpers
└── prisma/
    └── schema.prisma                # Database schema (future)
```

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint

# Database (Future)
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

### Key Technologies

**Next.js 15 App Router:**
- Server and Client Components
- API Routes for AI integration
- Server Actions (future feature)

**Zustand + LocalStorage:**
- Resume data persists across sessions
- Application state management
- Auto-save on every change

**React Hook Form + Zod:**
- Type-safe form validation
- Inline error messages
- Schema-based validation

**OpenAI Integration:**
- Model: gpt-4o-mini
- Temperature: 0.7 (tailoring), 0.8 (cover letter)
- JSON response format
- ~$0.001-0.005 per tailoring

**PDF Generation:**
- Client-side rendering with @react-pdf/renderer
- No server overhead
- Fast generation (1-2 seconds)
- ATS-compatible formatting

## Cost Estimates

**OpenAI API Costs:**
- Resume tailoring: $0.001-0.005 per request
- Cover letter: $0.001-0.003 per request
- Based on gpt-4o-mini pricing:
  - Input: $0.150 / 1M tokens
  - Output: $0.600 / 1M tokens

**Infrastructure:**
- PDF generation: $0 (client-side)
- Hosting: Varies by provider
- Storage: LocalStorage (free)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables → Add OPENAI_API_KEY
```

### Other Platforms

**Requirements:**
- Node.js 18+ runtime
- Environment variables support
- Static file serving

**Build command:**
```bash
npm run build
```

**Start command:**
```bash
npm start
```

## Troubleshooting

### OpenAI API Errors

**"Invalid API key"**
- Check `.env.local` has correct key
- Verify key starts with `sk-`
- Restart dev server after adding key

**"Rate limit exceeded"**
- Wait a few seconds and retry
- Check OpenAI usage limits
- Upgrade OpenAI account if needed

**"Insufficient quota"**
- Add payment method to OpenAI account
- Check account balance
- Review usage history

### PDF Download Issues

**PDF not downloading**
- Check browser popup blocker
- Try different browser
- Check browser console for errors

**PDF formatting issues**
- Verify resume data is complete
- Check for special characters in content
- Test with sample data

### State Persistence Issues

**Resume data lost**
- Check localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

**Tailoring results disappear**
- Results are cached in localStorage
- Clear cache if stale data appears
- Refresh page to see latest

## Known Limitations

1. **Single Template**: Only Classic template available
2. **No Preview**: PDF downloads directly without preview
3. **Letter Size Only**: US standard (8.5x11"), no A4
4. **No Database**: All data in localStorage (browser only)
5. **No Authentication**: No user accounts yet
6. **No Multi-Resume**: One resume at a time

## Future Enhancements

- [ ] Multiple resume templates (Modern, Creative, Executive)
- [ ] PDF preview modal before download
- [ ] User authentication and accounts
- [ ] Database storage for resume history
- [ ] Multiple tailored versions per resume
- [ ] A/B testing for summaries
- [ ] Job URL scraping (vs. paste)
- [ ] LinkedIn import
- [ ] Application tracking dashboard
- [ ] Email integration
- [ ] Team collaboration features

## License

[Add your license here]

## Support

For issues or questions:
1. Check troubleshooting section above
2. Search existing GitHub issues
3. Create new issue with details

## Credits

**Built with:**
- Next.js 15
- OpenAI GPT-4o-mini
- @react-pdf/renderer
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0-mvp
**Status**: Production Ready
