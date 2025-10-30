import { z } from 'zod'

// Contact Info Schema
export const contactInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
})

// Experience Entry Schema
export const experienceEntrySchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  dates: z.string().min(3, 'Dates are required'),
  location: z.string().min(2, 'Location is required'),
  bullets: z.array(z.string().min(10, 'Bullet must be at least 10 characters')).min(1, 'At least one bullet point required'),
})

// Education Entry Schema
export const educationEntrySchema = z.object({
  school: z.string().min(2, 'School name is required'),
  degree: z.string().min(2, 'Degree is required'),
  dates: z.string().min(4, 'Dates are required'),
})

// Full Resume Data Schema
export const resumeDataSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z.string().min(50, 'Summary must be at least 50 characters').max(500, 'Summary must be less than 500 characters'),
  experience: z.array(experienceEntrySchema).min(1, 'At least one experience entry required'),
  education: z.array(educationEntrySchema).min(1, 'At least one education entry required'),
  skills: z.array(z.string()).min(3, 'At least 3 skills required'),
})

// Job Description Schema
export const jobDescriptionSchema = z.object({
  companyName: z.string().optional(),
  roleTitle: z.string().optional(),
  employerWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().min(100, 'Job description must be at least 100 characters').max(10000, 'Job description too long'),
})

// API Request Schemas
export const tailorResumeRequestSchema = z.object({
  resumeId: z.string().cuid(),
  jobDescriptionId: z.string().cuid(),
})

export const generateCoverLetterRequestSchema = z.object({
  applicationId: z.string().cuid(),
  tone: z.enum(['professional', 'enthusiastic', 'concise']).default('professional'),
})

// Type exports
export type ContactInfoInput = z.infer<typeof contactInfoSchema>
export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>
export type EducationEntryInput = z.infer<typeof educationEntrySchema>
export type ResumeDataInput = z.infer<typeof resumeDataSchema>
export type JobDescriptionInput = z.infer<typeof jobDescriptionSchema>
export type TailorResumeRequest = z.infer<typeof tailorResumeRequestSchema>
export type GenerateCoverLetterRequest = z.infer<typeof generateCoverLetterRequestSchema>
