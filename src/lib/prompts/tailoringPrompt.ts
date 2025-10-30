/**
 * OpenAI Prompt Template for Resume Tailoring
 * Uses GPT-4o-mini to analyze job description and tailor resume accordingly
 */

import { ResumeData } from '@/lib/types/resume'

export interface TailoringContext {
  resume: ResumeData
  jobDescription: string
  companyName?: string
  roleTitle?: string
}

export function buildTailoringPrompt(context: TailoringContext): string {
  const { resume, jobDescription, companyName, roleTitle } = context

  return `You are an expert resume writer and career coach specializing in ATS (Applicant Tracking System) optimization and personalized job applications.

## Your Task

Tailor the provided resume to match the job description below. The goal is to maximize the candidate's chances of passing ATS screening and impressing human recruiters while maintaining complete honesty and accuracy.

## Job Description

${jobDescription}

${companyName ? `\n**Company**: ${companyName}` : ''}
${roleTitle ? `\n**Role**: ${roleTitle}` : ''}

## Current Resume

**Contact Information:**
Name: ${resume.contactInfo.name}
Email: ${resume.contactInfo.email}
Phone: ${resume.contactInfo.phone}
Location: ${resume.contactInfo.location}

**Professional Summary:**
${resume.summary}

**Work Experience:**
${resume.experience
  .map(
    (exp, idx) => `
${idx + 1}. ${exp.title} at ${exp.company}
   ${exp.startDate} - ${exp.endDate}${exp.location ? ` | ${exp.location}` : ''}
   ${exp.bullets.map((b) => `   • ${b}`).join('\n')}
`
  )
  .join('\n')}

**Education:**
${resume.education
  .map(
    (edu) => `
• ${edu.degree} - ${edu.school}
  ${edu.startDate} - ${edu.endDate}
`
  )
  .join('\n')}

**Skills:**
${resume.skills.join(', ')}

## Instructions

1. **Analyze the Job Description**: Identify key requirements, skills, technologies, and qualifications mentioned.

2. **Rewrite the Professional Summary**:
   - Make it specific to this role and company
   - Mention the company name and position title naturally
   - Highlight the 3-4 most relevant qualifications from the job description
   - Keep it between 50-120 words
   - Write in first person without using "I" (e.g., "Software engineer with 5 years..." not "I am a software engineer...")

3. **Optimize Experience Bullets**:
   - For each experience entry, rewrite bullets to emphasize skills/technologies mentioned in the job description
   - Use strong action verbs (Led, Developed, Implemented, Architected, Designed)
   - Include quantifiable achievements where possible
   - Incorporate relevant keywords from the job description naturally
   - Maintain truthfulness - do not fabricate achievements
   - Keep 3-5 bullets per role
   - Format: "Action verb + what you did + impact/result"

4. **Enhance Skills Section**:
   - Prioritize skills mentioned in the job description
   - Add any missing skills from the JD that the candidate likely has (based on their experience)
   - Group by category if relevant (e.g., "Languages:", "Frameworks:", "Tools:")
   - Include ATS keywords from the job posting

5. **Keep Education and Contact Info Unchanged**

## Output Format

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):

{
  "summary": "The tailored professional summary (50-120 words)",
  "experience": [
    {
      "title": "Original job title (unchanged)",
      "company": "Original company (unchanged)",
      "startDate": "Original start date (unchanged)",
      "endDate": "Original end date (unchanged)",
      "location": "Original location (unchanged)",
      "bullets": [
        "Tailored bullet point 1 with relevant keywords and achievements",
        "Tailored bullet point 2...",
        "..."
      ]
    }
  ],
  "skills": ["Prioritized", "Skills", "With", "JD", "Keywords"],
  "matchScore": 85,
  "keyChanges": [
    "Added emphasis on React and TypeScript in senior developer role",
    "Highlighted leadership experience relevant to team lead position",
    "Incorporated ATS keywords: agile, CI/CD, microservices"
  ],
  "atsKeywords": ["keyword1", "keyword2", "..."]
}

## Important Notes

- **Be Honest**: Never fabricate achievements or skills. Only emphasize and reframe what's already there.
- **ATS Optimization**: Include exact keywords from the job description where they naturally fit.
- **Match Score**: Estimate 0-100 based on how well the candidate's experience aligns with the job requirements.
- **Key Changes**: List 3-5 major modifications made to help the candidate understand what changed.
- **ATS Keywords**: Extract 10-15 critical keywords from the job description that should appear in the resume.

Begin analysis and return the JSON output now.`
}

/**
 * Cover Letter Generation Prompt
 */
export function buildCoverLetterPrompt(context: TailoringContext): string {
  const { resume, jobDescription, companyName, roleTitle } = context

  return `You are an expert cover letter writer specializing in creating compelling, personalized application letters.

## Your Task

Write a professional cover letter for this job application.

## Job Description

${jobDescription}

${companyName ? `\n**Company**: ${companyName}` : ''}
${roleTitle ? `\n**Role**: ${roleTitle}` : ''}

## Candidate Information

**Name**: ${resume.contactInfo.name}
**Summary**: ${resume.summary}

**Recent Experience**:
${resume.experience
  .slice(0, 2)
  .map((exp) => `• ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})`)
  .join('\n')}

**Skills**: ${resume.skills.join(', ')}

## Instructions

Write a compelling cover letter (250-400 words) that:

1. **Opening**: Express genuine interest in the role and company. Mention the specific position.

2. **Why This Company**: Show you've researched the company. Reference their mission, products, or recent news if possible from the job description.

3. **Why You're a Great Fit**:
   - Highlight 2-3 specific experiences that directly relate to job requirements
   - Use concrete examples with quantifiable achievements
   - Connect your skills to their needs

4. **Closing**: Express enthusiasm, mention availability for interview, thank them.

5. **Tone**: Professional but personable, confident but humble, enthusiastic but not desperate.

## Output Format

Return ONLY a valid JSON object (no markdown, no code fences):

{
  "coverLetter": "The complete cover letter text with proper paragraphs and formatting",
  "tone": "professional-enthusiastic",
  "keyPoints": [
    "Main selling point 1",
    "Main selling point 2",
    "Main selling point 3"
  ]
}

Begin writing now.`
}

/**
 * Quick validation function for AI responses
 */
export function validateTailoringResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.summary === 'string' &&
    Array.isArray(response.experience) &&
    Array.isArray(response.skills) &&
    typeof response.matchScore === 'number' &&
    response.matchScore >= 0 &&
    response.matchScore <= 100
  )
}

/**
 * Quick validation for cover letter response
 */
export function validateCoverLetterResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.coverLetter === 'string' &&
    response.coverLetter.length >= 250 &&
    response.coverLetter.length <= 2000
  )
}
