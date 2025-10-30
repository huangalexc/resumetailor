'use server'

import { auth } from '@/../auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { resumeDataSchema } from '@/lib/schemas/resume'
import type { ResumeData } from '@/lib/types/resume'
import type { Resume } from '@prisma/client'

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Create a new resume for the authenticated user
 */
export async function createResume(data: ResumeData): Promise<ActionResult<Resume>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate data
    const validated = resumeDataSchema.parse(data)

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        data: JSON.stringify(validated),
        template: 'classic',
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/resumes')
    return { success: true, data: resume }
  } catch (error) {
    console.error('Create resume error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: 'Invalid resume data' }
    }
    return { success: false, error: 'Failed to create resume' }
  }
}

/**
 * Update an existing resume
 */
export async function updateResume(
  id: string,
  data: Partial<ResumeData>
): Promise<ActionResult<Resume>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify ownership
    const existing = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true, data: true },
    })

    if (!existing) {
      return { success: false, error: 'Resume not found' }
    }

    if (existing.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Merge with existing data
    const currentData = JSON.parse(existing.data) as ResumeData
    const mergedData = { ...currentData, ...data }

    // Validate merged data
    const validated = resumeDataSchema.parse(mergedData)

    const resume = await prisma.resume.update({
      where: { id },
      data: {
        data: JSON.stringify(validated),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/resumes')
    revalidatePath(`/dashboard/resumes/${id}`)
    revalidatePath(`/dashboard/resumes/${id}/edit`)
    return { success: true, data: resume }
  } catch (error) {
    console.error('Update resume error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: 'Invalid resume data' }
    }
    return { success: false, error: 'Failed to update resume' }
  }
}

/**
 * Get all resumes for the authenticated user
 */
export async function getUserResumes(): Promise<ActionResult<Resume[]>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        applications: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            createdAt: true,
            status: true,
            jobDescription: {
              select: {
                companyName: true,
                roleTitle: true,
              },
            },
          },
        },
      },
    })

    return { success: true, data: resumes }
  } catch (error) {
    console.error('Get resumes error:', error)
    return { success: false, error: 'Failed to fetch resumes' }
  }
}

/**
 * Get a single resume by ID
 */
export async function getResume(id: string): Promise<ActionResult<Resume & { parsedData: ResumeData }>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
          include: {
            jobDescription: {
              select: {
                id: true,
                companyName: true,
                roleTitle: true,
                employerWebsite: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    if (!resume) {
      return { success: false, error: 'Resume not found' }
    }

    if (resume.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Parse the JSON data for convenience
    const parsedData = JSON.parse(resume.data) as ResumeData

    return {
      success: true,
      data: { ...resume, parsedData }
    }
  } catch (error) {
    console.error('Get resume error:', error)
    return { success: false, error: 'Failed to fetch resume' }
  }
}

/**
 * Delete a resume
 */
export async function deleteResume(id: string): Promise<ActionResult<void>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify ownership
    const resume = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!resume) {
      return { success: false, error: 'Resume not found' }
    }

    if (resume.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete resume (cascade will handle applications)
    await prisma.resume.delete({ where: { id } })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/resumes')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete resume error:', error)
    return { success: false, error: 'Failed to delete resume' }
  }
}

/**
 * Duplicate a resume
 */
export async function duplicateResume(id: string): Promise<ActionResult<Resume>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const original = await prisma.resume.findUnique({
      where: { id },
    })

    if (!original) {
      return { success: false, error: 'Resume not found' }
    }

    if (original.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const duplicate = await prisma.resume.create({
      data: {
        userId: session.user.id,
        data: original.data,
        template: original.template,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/resumes')
    return { success: true, data: duplicate }
  } catch (error) {
    console.error('Duplicate resume error:', error)
    return { success: false, error: 'Failed to duplicate resume' }
  }
}

/**
 * Get resume statistics for the user
 */
export async function getResumeStats(): Promise<ActionResult<{
  totalResumes: number
  totalApplications: number
  recentActivity: Date | null
}>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const [totalResumes, totalApplications, recentResume] = await Promise.all([
      prisma.resume.count({
        where: { userId: session.user.id },
      }),
      prisma.application.count({
        where: {
          resume: {
            userId: session.user.id,
          },
        },
      }),
      prisma.resume.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
    ])

    return {
      success: true,
      data: {
        totalResumes,
        totalApplications,
        recentActivity: recentResume?.updatedAt || null,
      },
    }
  } catch (error) {
    console.error('Get resume stats error:', error)
    return { success: false, error: 'Failed to fetch statistics' }
  }
}
