import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeData } from '@/lib/types/resume'

interface ResumeStore {
  // Current resume being edited
  currentResume: Partial<ResumeData> | null

  // Resume ID if saved to database
  resumeId: string | null

  // Actions
  updateContactInfo: (contactInfo: ResumeData['contactInfo']) => void
  updateSummary: (summary: string) => void
  addExperience: (experience: ResumeData['experience'][0]) => void
  updateExperience: (index: number, experience: ResumeData['experience'][0]) => void
  removeExperience: (index: number) => void
  addEducation: (education: ResumeData['education'][0]) => void
  updateEducation: (index: number, education: ResumeData['education'][0]) => void
  removeEducation: (index: number) => void
  updateSkills: (skills: string[]) => void
  setResumeId: (id: string) => void
  clearResume: () => void
  loadResume: (resume: ResumeData, id?: string) => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      currentResume: null,
      resumeId: null,

      updateContactInfo: (contactInfo) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            contactInfo,
          },
        })),

      updateSummary: (summary) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            summary,
          },
        })),

      addExperience: (experience) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: [...(state.currentResume?.experience || []), experience],
          },
        })),

      updateExperience: (index, experience) =>
        set((state) => {
          const experiences = [...(state.currentResume?.experience || [])]
          experiences[index] = experience
          return {
            currentResume: {
              ...state.currentResume,
              experience: experiences,
            },
          }
        }),

      removeExperience: (index) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            experience: state.currentResume?.experience?.filter((_, i) => i !== index),
          },
        })),

      addEducation: (education) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: [...(state.currentResume?.education || []), education],
          },
        })),

      updateEducation: (index, education) =>
        set((state) => {
          const educations = [...(state.currentResume?.education || [])]
          educations[index] = education
          return {
            currentResume: {
              ...state.currentResume,
              education: educations,
            },
          }
        }),

      removeEducation: (index) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            education: state.currentResume?.education?.filter((_, i) => i !== index),
          },
        })),

      updateSkills: (skills) =>
        set((state) => ({
          currentResume: {
            ...state.currentResume,
            skills,
          },
        })),

      setResumeId: (id) => set({ resumeId: id }),

      clearResume: () => set({ currentResume: null, resumeId: null }),

      loadResume: (resume, id) =>
        set({
          currentResume: resume,
          resumeId: id || null,
        }),
    }),
    {
      name: 'resume-storage', // localStorage key
      partialize: (state) => ({
        currentResume: state.currentResume,
        resumeId: state.resumeId,
      }),
    }
  )
)
