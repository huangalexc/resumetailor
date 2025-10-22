/**
 * PDF Generation Utility
 * Handles client-side PDF generation and download
 */

import { pdf } from '@react-pdf/renderer'
import { ResumeData } from '@/lib/types/resume'
import { ClassicPdfTemplate } from '@/components/resume/templates/ClassicPdfTemplate'
import { createElement } from 'react'

/**
 * Generate PDF blob from resume data
 */
export async function generateResumePdf(
  resumeData: ResumeData
): Promise<Blob> {
  const document = createElement(ClassicPdfTemplate, { data: resumeData })
  const blob = await pdf(document).toBlob()
  return blob
}

/**
 * Download PDF file to user's computer
 */
export async function downloadResumePdf(
  resumeData: ResumeData,
  filename?: string
): Promise<void> {
  try {
    // Generate PDF blob
    const blob = await generateResumePdf(resumeData)

    // Create download filename
    const defaultFilename = generateFilename(resumeData.contactInfo.name)
    const finalFilename = filename || defaultFilename

    // Create download link and trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = finalFilename
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Generate filename from candidate name
 * Format: FirstName_LastName_Resume.pdf
 */
function generateFilename(fullName: string): string {
  const sanitized = fullName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
  return `${sanitized}_Resume.pdf`
}

/**
 * Generate tailored resume filename
 * Format: FirstName_LastName_CompanyName_Resume.pdf
 */
export function generateTailoredFilename(
  fullName: string,
  companyName?: string
): string {
  const sanitizedName = fullName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')

  if (companyName) {
    const sanitizedCompany = companyName
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
    return `${sanitizedName}_${sanitizedCompany}_Resume.pdf`
  }

  return `${sanitizedName}_Resume.pdf`
}

/**
 * Preview PDF in new tab (useful for testing)
 */
export async function previewResumePdf(
  resumeData: ResumeData
): Promise<void> {
  try {
    const blob = await generateResumePdf(resumeData)
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (error) {
    console.error('PDF preview failed:', error)
    throw new Error('Failed to preview PDF. Please try again.')
  }
}
