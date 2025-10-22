// TypeScript types for resume data matching PRD schema

export interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
}

export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  location: string
  bullets: string[]
}

export interface EducationEntry {
  school: string
  degree: string
  dates: string
}

export interface ResumeData {
  contactInfo: ContactInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
}

export interface JobDescriptionData {
  companyName?: string
  roleTitle?: string
  employerWebsite?: string
  description: string
}

export interface TailoredResumeData extends ResumeData {
  // Tailored version extends base resume
}

export interface CoverLetterData {
  content: string
  tone: 'professional' | 'enthusiastic' | 'concise'
}
