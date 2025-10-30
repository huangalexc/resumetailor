import { createResume } from '@/app/actions/resume.actions'
import type { ResumeData } from '@/lib/types/resume'

interface MigrationResult {
  success: boolean
  migrated: number
  resumeId?: string
  error?: string
}

/**
 * Migrate resume data from localStorage to database
 * This should be called once when a user first logs in after the database migration
 */
export async function migrateLocalStorageToDatabase(): Promise<MigrationResult> {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return { success: false, migrated: 0, error: 'Not in browser environment' }
    }

    // Get resume data from localStorage
    const storedData = localStorage.getItem('resume-storage')

    if (!storedData) {
      return { success: true, migrated: 0 } // Nothing to migrate
    }

    const parsed = JSON.parse(storedData)
    const resumeData: ResumeData | null = parsed.state?.currentResume

    if (!resumeData) {
      return { success: true, migrated: 0 } // No resume data found
    }

    // Validate that we have all required fields for a complete resume
    if (
      !resumeData.contactInfo ||
      !resumeData.summary ||
      !resumeData.experience ||
      !resumeData.education ||
      !resumeData.skills
    ) {
      // Incomplete resume, don't migrate
      return { success: true, migrated: 0, error: 'Incomplete resume data' }
    }

    // Create resume in database
    const result = await createResume(resumeData)

    if (result.success) {
      // Clear localStorage after successful migration
      localStorage.removeItem('resume-storage')

      return {
        success: true,
        migrated: 1,
        resumeId: result.data.id,
      }
    }

    return {
      success: false,
      migrated: 0,
      error: result.error,
    }
  } catch (error) {
    console.error('Migration error:', error)
    return {
      success: false,
      migrated: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if user has localStorage data that needs migration
 */
export function hasLocalStorageData(): boolean {
  if (typeof window === 'undefined') return false

  const storedData = localStorage.getItem('resume-storage')
  if (!storedData) return false

  try {
    const parsed = JSON.parse(storedData)
    return !!parsed.state?.currentResume
  } catch {
    return false
  }
}

/**
 * Clear localStorage data (use after successful migration)
 */
export function clearLocalStorageData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('resume-storage')
}
