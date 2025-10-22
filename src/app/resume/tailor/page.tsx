'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/hooks/useResumeStore'
import { useApplicationStore } from '@/hooks/useApplicationStore'
import { ClassicTemplate } from '@/components/resume/templates/ClassicTemplate'
import { Button } from '@/components/ui/button'
import { ResumeData } from '@/lib/types/resume'
import { TailorRequest, TailorResponse } from '@/app/api/tailor/route'
import {
  CoverLetterRequest,
  CoverLetterResponse,
} from '@/app/api/cover-letter/route'
import {
  downloadResumePdf,
  generateTailoredFilename,
} from '@/lib/utils/pdfGenerator'

export default function TailorPage() {
  const router = useRouter()
  const { currentResume } = useResumeStore()
  const {
    jobDescription,
    tailoredResume,
    coverLetter,
    isTailoring,
    isGeneratingCoverLetter,
    tailoringError,
    coverLetterError,
    setTailoredResume,
    setCoverLetter,
    setTailoringState,
    setCoverLetterState,
  } = useApplicationStore()

  const [showComparison, setShowComparison] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Auto-trigger tailoring on mount if not already done
  useEffect(() => {
    if (currentResume && jobDescription && !tailoredResume && !isTailoring) {
      handleTailor()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTailor = async () => {
    if (!currentResume || !jobDescription) return

    setTailoringState(true)

    try {
      const requestBody: TailorRequest = {
        resume: currentResume,
        jobDescription: jobDescription.description,
        companyName: jobDescription.companyName,
        roleTitle: jobDescription.roleTitle,
      }

      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data: TailorResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to tailor resume')
      }

      setTailoredResume(data.data)
      setShowComparison(true)
    } catch (error) {
      console.error('Tailoring error:', error)
      setTailoringState(
        false,
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!currentResume || !jobDescription) return

    setCoverLetterState(true)

    try {
      const requestBody: CoverLetterRequest = {
        resume: currentResume,
        jobDescription: jobDescription.description,
        companyName: jobDescription.companyName,
        roleTitle: jobDescription.roleTitle,
      }

      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data: CoverLetterResponse = await response.json()

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate cover letter')
      }

      setCoverLetter(data.data)
    } catch (error) {
      console.error('Cover letter error:', error)
      setCoverLetterState(
        false,
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  const handleDownloadPdf = async () => {
    if (!tailoredResumeData) return

    setIsDownloading(true)

    try {
      const filename = generateTailoredFilename(
        currentResume?.contactInfo.name || 'Resume',
        jobDescription?.companyName
      )

      await downloadResumePdf(tailoredResumeData, filename)
    } catch (error) {
      console.error('PDF download error:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to download PDF. Please try again.'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  // Check if resume and job description exist
  if (!currentResume || !jobDescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Missing Information
          </h2>
          <p className="text-slate-600 mb-6">
            Please complete your resume and add a job description first.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push('/resume/builder')}>
              Go to Resume Builder
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/job-description')}
            >
              Add Job Description
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Build tailored resume data for preview
  const tailoredResumeData: ResumeData | null = tailoredResume
    ? {
        contactInfo: currentResume.contactInfo,
        summary: tailoredResume.summary,
        experience: tailoredResume.experience,
        education: currentResume.education,
        skills: tailoredResume.skills,
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            AI Resume Tailoring
          </h1>
          <p className="text-slate-600 mt-2">
            {jobDescription.companyName && jobDescription.roleTitle
              ? `Tailoring your resume for ${jobDescription.roleTitle} at ${jobDescription.companyName}`
              : 'Optimizing your resume for this job opportunity'}
          </p>
        </div>

        {/* Loading State */}
        {isTailoring && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              AI is analyzing and tailoring your resume...
            </h2>
            <p className="text-slate-600">
              This usually takes 10-30 seconds. Hang tight!
            </p>
          </div>
        )}

        {/* Error State */}
        {tailoringError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Tailoring Failed
            </h3>
            <p className="text-red-700 mb-4">{tailoringError}</p>
            <Button onClick={handleTailor}>Try Again</Button>
          </div>
        )}

        {/* Match Score & Key Changes */}
        {tailoredResume && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Tailoring Complete!
                </h2>
                <p className="text-slate-600">
                  Your resume has been optimized for this role
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {tailoredResume.matchScore}%
                </div>
                <div className="text-sm text-slate-600">Match Score</div>
              </div>
            </div>

            {/* Key Changes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                What Changed:
              </h3>
              <ul className="space-y-1">
                {tailoredResume.keyChanges.map((change, idx) => (
                  <li key={idx} className="text-sm text-blue-800">
                    • {change}
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Keywords */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">
                ATS Keywords Added:
              </h3>
              <div className="flex flex-wrap gap-2">
                {tailoredResume.atsKeywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Before/After Comparison Toggle */}
        {tailoredResume && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Resume Preview
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={!showComparison ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowComparison(false)}
                >
                  Tailored Version
                </Button>
                <Button
                  variant={showComparison ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowComparison(true)}
                >
                  Before/After Comparison
                </Button>
              </div>
            </div>

            {!showComparison ? (
              <div className="border-2 border-slate-200 rounded-lg p-8 bg-slate-50 overflow-auto max-h-[800px]">
                {tailoredResumeData && (
                  <ClassicTemplate data={tailoredResumeData} variant="web" />
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Original Resume
                  </h4>
                  <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50 overflow-auto max-h-[600px]">
                    <ClassicTemplate data={currentResume} variant="web" />
                  </div>
                </div>

                {/* Tailored */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    Tailored Resume ✨
                  </h4>
                  <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50 overflow-auto max-h-[600px]">
                    {tailoredResumeData && (
                      <ClassicTemplate data={tailoredResumeData} variant="web" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Section */}
        {tailoredResume && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Cover Letter
            </h3>

            {!coverLetter && !isGeneratingCoverLetter && (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">
                  Generate a personalized cover letter for this application
                </p>
                <Button onClick={handleGenerateCoverLetter}>
                  Generate Cover Letter
                </Button>
              </div>
            )}

            {isGeneratingCoverLetter && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600">
                  Generating personalized cover letter...
                </p>
              </div>
            )}

            {coverLetterError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 mb-2">{coverLetterError}</p>
                <Button size="sm" onClick={handleGenerateCoverLetter}>
                  Try Again
                </Button>
              </div>
            )}

            {coverLetter && (
              <div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-4">
                  <div className="whitespace-pre-wrap font-serif leading-relaxed">
                    {coverLetter.coverLetter}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <strong>Key Points:</strong>
                  <ul className="mt-2 space-y-1">
                    {coverLetter.keyPoints.map((point, idx) => (
                      <li key={idx}>• {point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {tailoredResume && (
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/job-description')}
            >
              ← Edit Job Description
            </Button>
            <Button
              size="lg"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF...' : 'Download Tailored Resume'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/resume/builder')}
            >
              Back to Builder
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
