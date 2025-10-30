import { create } from 'zustand'
import {
  createResume,
  updateResume,
  getUserResumes,
  getResume,
  deleteResume,
  duplicateResume,
  getResumeStats,
} from '@/app/actions/resume.actions'
import type { ResumeData } from '@/lib/types/resume'
import type { Resume } from '@prisma/client'

interface ResumeStore {
  // State
  resumes: Resume[]
  currentResume: Resume | null
  currentResumeData: Partial<ResumeData> | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: Date | null

  // Stats
  stats: {
    totalResumes: number
    totalApplications: number
    recentActivity: Date | null
  } | null

  // Actions - Fetch operations
  fetchResumes: () => Promise<void>
  fetchResume: (id: string) => Promise<void>
  fetchStats: () => Promise<void>

  // Actions - CRUD operations
  createNewResume: (data: ResumeData) => Promise<Resume | null>
  updateCurrentResume: (data: Partial<ResumeData>) => Promise<void>
  saveCurrentResume: () => Promise<void>
  deleteResumeById: (id: string) => Promise<void>
  duplicateResumeById: (id: string) => Promise<Resume | null>

  // Actions - Local state management
  setCurrentResume: (resume: Resume | null) => void
  updateLocalResumeData: (data: Partial<ResumeData>) => void
  loadResumeData: (data: ResumeData) => void
  clearCurrentResume: () => void
  clearError: () => void

  // Auto-save
  enableAutoSave: (resumeId: string) => void
  disableAutoSave: () => void
}

// Auto-save interval reference
let autoSaveInterval: NodeJS.Timeout | null = null

export const useResumeStore = create<ResumeStore>((set, get) => ({
  // Initial state
  resumes: [],
  currentResume: null,
  currentResumeData: null,
  isLoading: false,
  isSaving: false,
  error: null,
  lastSaved: null,
  stats: null,

  // Fetch all user resumes
  fetchResumes: async () => {
    set({ isLoading: true, error: null })
    const result = await getUserResumes()

    if (result.success) {
      set({ resumes: result.data, isLoading: false })
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  // Fetch single resume
  fetchResume: async (id: string) => {
    set({ isLoading: true, error: null })
    const result = await getResume(id)

    if (result.success) {
      const { parsedData, ...resume } = result.data
      set({
        currentResume: resume,
        currentResumeData: parsedData,
        isLoading: false,
      })
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  // Fetch user statistics
  fetchStats: async () => {
    const result = await getResumeStats()

    if (result.success) {
      set({ stats: result.data })
    }
  },

  // Create new resume
  createNewResume: async (data: ResumeData) => {
    set({ isSaving: true, error: null })
    const result = await createResume(data)

    if (result.success) {
      set((state) => ({
        resumes: [result.data, ...state.resumes],
        currentResume: result.data,
        currentResumeData: data,
        isSaving: false,
        lastSaved: new Date(),
      }))
      return result.data
    } else {
      set({ error: result.error, isSaving: false })
      return null
    }
  },

  // Update current resume with partial data
  updateCurrentResume: async (data: Partial<ResumeData>) => {
    const { currentResume, currentResumeData } = get()
    if (!currentResume) {
      set({ error: 'No resume selected' })
      return
    }

    // Update local state immediately (optimistic update)
    const mergedData = { ...currentResumeData, ...data }
    set({ currentResumeData: mergedData as ResumeData })

    // Then update in database
    set({ isSaving: true, error: null })
    const result = await updateResume(currentResume.id, data)

    if (result.success) {
      set((state) => ({
        currentResume: result.data,
        resumes: state.resumes.map((r) =>
          r.id === result.data.id ? result.data : r
        ),
        isSaving: false,
        lastSaved: new Date(),
      }))
    } else {
      // Revert optimistic update on error
      set({
        currentResumeData: currentResumeData,
        error: result.error,
        isSaving: false,
      })
    }
  },

  // Save current resume data to database
  saveCurrentResume: async () => {
    const { currentResume, currentResumeData } = get()

    if (!currentResumeData) {
      set({ error: 'No resume data to save' })
      return
    }

    // If no current resume, create new one
    if (!currentResume) {
      await get().createNewResume(currentResumeData as ResumeData)
      return
    }

    // Otherwise update existing
    set({ isSaving: true, error: null })
    const result = await updateResume(currentResume.id, currentResumeData)

    if (result.success) {
      set((state) => ({
        currentResume: result.data,
        resumes: state.resumes.map((r) =>
          r.id === result.data.id ? result.data : r
        ),
        isSaving: false,
        lastSaved: new Date(),
      }))
    } else {
      set({ error: result.error, isSaving: false })
    }
  },

  // Delete resume
  deleteResumeById: async (id: string) => {
    set({ isLoading: true, error: null })
    const result = await deleteResume(id)

    if (result.success) {
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id),
        currentResume:
          state.currentResume?.id === id ? null : state.currentResume,
        currentResumeData:
          state.currentResume?.id === id ? null : state.currentResumeData,
        isLoading: false,
      }))
    } else {
      set({ error: result.error, isLoading: false })
    }
  },

  // Duplicate resume
  duplicateResumeById: async (id: string) => {
    set({ isLoading: true, error: null })
    const result = await duplicateResume(id)

    if (result.success) {
      set((state) => ({
        resumes: [result.data, ...state.resumes],
        isLoading: false,
      }))
      return result.data
    } else {
      set({ error: result.error, isLoading: false })
      return null
    }
  },

  // Set current resume (from list selection)
  setCurrentResume: (resume: Resume | null) => {
    if (resume) {
      const parsedData = JSON.parse(resume.data) as ResumeData
      set({
        currentResume: resume,
        currentResumeData: parsedData,
      })
    } else {
      set({
        currentResume: null,
        currentResumeData: null,
      })
    }
  },

  // Update local resume data without saving
  updateLocalResumeData: (data: Partial<ResumeData>) => {
    set((state) => ({
      currentResumeData: {
        ...state.currentResumeData,
        ...data,
      } as ResumeData,
    }))
  },

  // Load resume data into current state
  loadResumeData: (data: ResumeData) => {
    set({ currentResumeData: data })
  },

  // Clear current resume
  clearCurrentResume: () => {
    set({
      currentResume: null,
      currentResumeData: null,
      error: null,
    })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Enable auto-save (save every 5 seconds if there are unsaved changes)
  enableAutoSave: (resumeId: string) => {
    // Clear existing interval if any
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }

    autoSaveInterval = setInterval(async () => {
      const { currentResume, currentResumeData, isSaving } = get()

      // Only auto-save if:
      // 1. We have a current resume
      // 2. The resume ID matches
      // 3. We're not already saving
      // 4. We have data to save
      if (
        currentResume &&
        currentResume.id === resumeId &&
        !isSaving &&
        currentResumeData
      ) {
        await get().saveCurrentResume()
      }
    }, 5000) // Auto-save every 5 seconds
  },

  // Disable auto-save
  disableAutoSave: () => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
  },
}))

// Cleanup on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }
  })
}
