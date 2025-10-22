/**
 * Zustand store for managing application state
 * Handles job description, tailoring results, and cover letter
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface JobDescriptionData {
  description: string
  companyName?: string
  roleTitle?: string
  employerWebsite?: string
}

export interface TailoredResumeData {
  summary: string
  experience: Array<{
    title: string
    company: string
    startDate: string
    endDate: string
    location?: string
    bullets: string[]
  }>
  skills: string[]
  matchScore: number
  keyChanges: string[]
  atsKeywords: string[]
}

export interface CoverLetterData {
  coverLetter: string
  tone: string
  keyPoints: string[]
}

export interface ApplicationState {
  // Current job description
  jobDescription: JobDescriptionData | null

  // Tailoring results
  tailoredResume: TailoredResumeData | null
  coverLetter: CoverLetterData | null

  // Loading states
  isTailoring: boolean
  isGeneratingCoverLetter: boolean

  // Error states
  tailoringError: string | null
  coverLetterError: string | null

  // Actions
  setJobDescription: (jobDescription: JobDescriptionData) => void
  setTailoredResume: (tailoredResume: TailoredResumeData) => void
  setCoverLetter: (coverLetter: CoverLetterData) => void
  setTailoringState: (isTailoring: boolean, error?: string | null) => void
  setCoverLetterState: (isGenerating: boolean, error?: string | null) => void
  clearApplication: () => void
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      // Initial state
      jobDescription: null,
      tailoredResume: null,
      coverLetter: null,
      isTailoring: false,
      isGeneratingCoverLetter: false,
      tailoringError: null,
      coverLetterError: null,

      // Set job description from form
      setJobDescription: (jobDescription) =>
        set({ jobDescription }),

      // Set tailored resume results from API
      setTailoredResume: (tailoredResume) =>
        set({
          tailoredResume,
          isTailoring: false,
          tailoringError: null,
        }),

      // Set cover letter results from API
      setCoverLetter: (coverLetter) =>
        set({
          coverLetter,
          isGeneratingCoverLetter: false,
          coverLetterError: null,
        }),

      // Update tailoring loading/error state
      setTailoringState: (isTailoring, error = null) =>
        set({
          isTailoring,
          tailoringError: error,
        }),

      // Update cover letter loading/error state
      setCoverLetterState: (isGenerating, error = null) =>
        set({
          isGeneratingCoverLetter: isGenerating,
          coverLetterError: error,
        }),

      // Clear all application data (start over)
      clearApplication: () =>
        set({
          jobDescription: null,
          tailoredResume: null,
          coverLetter: null,
          isTailoring: false,
          isGeneratingCoverLetter: false,
          tailoringError: null,
          coverLetterError: null,
        }),
    }),
    {
      name: 'application-storage',
    }
  )
)
