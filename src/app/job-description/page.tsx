'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobDescriptionSchema, JobDescriptionInput } from '@/lib/schemas/resume'
import { extractJobMetadata } from '@/lib/helpers/extractJobMetadata'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/hooks/useResumeStore'
import { useApplicationStore } from '@/hooks/useApplicationStore'

export default function JobDescriptionPage() {
  const router = useRouter()
  const { currentResume } = useResumeStore()
  const { setJobDescription } = useApplicationStore()
  const [charCount, setCharCount] = useState(0)
  const [extractedMetadata, setExtractedMetadata] = useState<{
    companyName?: string
    roleTitle?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobDescriptionInput>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      description: '',
      companyName: '',
      roleTitle: '',
      employerWebsite: '',
    },
  })

  const descriptionValue = watch('description')

  // Extract metadata when description changes
  useEffect(() => {
    if (descriptionValue && descriptionValue.length > 100) {
      const metadata = extractJobMetadata(descriptionValue)
      setExtractedMetadata(metadata)

      // Auto-fill if fields are empty
      const currentCompany = watch('companyName')
      const currentRole = watch('roleTitle')

      if (!currentCompany && metadata.companyName) {
        setValue('companyName', metadata.companyName)
      }
      if (!currentRole && metadata.roleTitle) {
        setValue('roleTitle', metadata.roleTitle)
      }
    }
    setCharCount(descriptionValue?.length || 0)
  }, [descriptionValue, setValue, watch])

  const onSubmit = async (data: JobDescriptionInput) => {
    // Save job description to application store
    setJobDescription({
      description: data.description,
      companyName: data.companyName,
      roleTitle: data.roleTitle,
      employerWebsite: data.employerWebsite,
    })

    // Navigate to tailoring page
    router.push('/resume/tailor')
  }

  const handleBack = () => {
    router.push('/resume/builder')
  }

  const getCharCountColor = () => {
    if (charCount < 100) return 'text-red-500'
    if (charCount > 10000) return 'text-red-500'
    return 'text-slate-600'
  }

  // Check if resume is complete
  const isResumeComplete = currentResume?.contactInfo &&
    currentResume?.summary &&
    currentResume?.experience &&
    currentResume.experience.length > 0

  if (!isResumeComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Resume Required
          </h2>
          <p className="text-slate-600 mb-6">
            Please complete your resume before adding a job description.
          </p>
          <Button onClick={() => router.push('/resume/builder')}>
            Go to Resume Builder
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add Job Description</h1>
          <p className="text-slate-600 mt-2">
            Paste the full job posting below. We'll use this to tailor your resume to match the role.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Description Textarea */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Job Description *</Label>
                <span className={`text-sm ${getCharCountColor()}`}>
                  {charCount} / 10,000 characters
                </span>
              </div>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Paste the complete job posting here...

Example:
Software Engineer - TechCorp
Location: San Francisco, CA

About TechCorp:
We are a leading technology company...

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code

Requirements:
- 3+ years of experience with JavaScript
- Strong knowledge of React and Node.js
- Bachelor's degree in Computer Science"
                className={`min-h-[400px] font-mono text-sm ${errors.description ? 'border-red-500' : ''}`}
                maxLength={10000}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
              {charCount >= 100 && charCount <= 10000 && (
                <p className="text-sm text-green-600">
                  ✓ Job description looks good
                </p>
              )}
            </div>

            {/* Auto-extracted Metadata Notice */}
            {extractedMetadata && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  🤖 Auto-detected information:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  {extractedMetadata.companyName && (
                    <li>• Company: {extractedMetadata.companyName}</li>
                  )}
                  {extractedMetadata.roleTitle && (
                    <li>• Role: {extractedMetadata.roleTitle}</li>
                  )}
                </ul>
                <p className="text-xs text-blue-700 mt-2">
                  You can edit these fields below if needed.
                </p>
              </div>
            )}

            {/* Optional Metadata Fields */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-slate-900">
                Optional Details (auto-detected)
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="e.g., TechCorp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roleTitle">Job Title</Label>
                  <Input
                    id="roleTitle"
                    {...register('roleTitle')}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employerWebsite">Company Website</Label>
                <Input
                  id="employerWebsite"
                  {...register('employerWebsite')}
                  placeholder="https://techcorp.com"
                  type="url"
                />
                {errors.employerWebsite && (
                  <p className="text-sm text-red-500">{errors.employerWebsite.message}</p>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">💡 Tips for best results:</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Include the complete job posting, not just a summary</li>
                <li>• Keep formatting simple (no special characters or tables)</li>
                <li>• Include requirements, responsibilities, and company info</li>
                <li>• The more detail, the better the AI can tailor your resume</li>
              </ul>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
              >
                Back to Resume
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={charCount < 100}
              >
                Continue to Tailor Resume →
              </Button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <p className="text-sm text-blue-800">
            Our AI will analyze this job description and automatically rewrite your resume to:
          </p>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>✓ Highlight your most relevant experience</li>
            <li>✓ Include keywords from the job posting</li>
            <li>✓ Emphasize accomplishments that match requirements</li>
            <li>✓ Optimize for Applicant Tracking Systems (ATS)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
