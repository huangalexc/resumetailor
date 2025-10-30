'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/hooks/useResumeStore'
import { ContactInfoForm } from '@/components/resume/forms/ContactInfoForm'
import { SummaryForm } from '@/components/resume/forms/SummaryForm'
import { ExperienceForm } from '@/components/resume/forms/ExperienceForm'
import { EducationForm } from '@/components/resume/forms/EducationForm'
import { SkillsForm } from '@/components/resume/forms/SkillsForm'
import { Button } from '@/components/ui/button'
import { ResumeData } from '@/lib/types/resume'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const steps = [
  { id: 1, name: 'Contact Info', component: ContactInfoForm },
  { id: 2, name: 'Summary', component: SummaryForm },
  { id: 3, name: 'Experience', component: ExperienceForm },
  { id: 4, name: 'Education', component: EducationForm },
  { id: 5, name: 'Skills', component: SkillsForm },
]

export default function ResumeBuilderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { currentResumeData, updateLocalResumeData, createNewResume } = useResumeStore()
  const [isCreating, setIsCreating] = useState(false)

  const CurrentFormComponent = steps.find((s) => s.id === currentStep)?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = (stepId: number): boolean => {
    if (!currentResumeData) return false

    switch (stepId) {
      case 1: // Contact Info
        return !!(
          currentResumeData.contactInfo?.name &&
          currentResumeData.contactInfo?.email
        )
      case 2: // Summary
        return !!(currentResumeData.summary && currentResumeData.summary.length > 0)
      case 3: // Experience
        return !!(
          currentResumeData.experience &&
          currentResumeData.experience.length > 0
        )
      case 4: // Education
        return !!(
          currentResumeData.education &&
          currentResumeData.education.length > 0
        )
      case 5: // Skills
        return !!(currentResumeData.skills && currentResumeData.skills.length > 0)
      default:
        return false
    }
  }

  const isResumeComplete = (): boolean => {
    return steps.every((step) => isStepComplete(step.id))
  }

  const handleCreateResume = async () => {
    if (!currentResumeData || !isResumeComplete()) return

    setIsCreating(true)
    try {
      const resume = await createNewResume(currentResumeData as ResumeData)
      if (resume) {
        // Redirect to the editor for the newly created resume
        router.push(`/dashboard/resumes/${resume.id}/edit`)
      }
    } catch (error) {
      console.error('Failed to create resume:', error)
      alert('Failed to create resume. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Create Your Resume</h1>
          <p className="text-slate-600 mt-2">
            Fill in each section step-by-step. Your progress is saved locally until you finish.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : isStepComplete(step.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isStepComplete(step.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        currentStep === step.id
                          ? 'text-primary font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isStepComplete(step.id)
                          ? 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">
              {steps.find((s) => s.id === currentStep)?.name}
            </h2>
            {CurrentFormComponent && (
              <CurrentFormComponent
                onNext={handleNext}
                onBack={currentStep > 1 ? handleBack : undefined}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={!isStepComplete(currentStep)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateResume}
                disabled={!isResumeComplete() || isCreating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  'Creating Resume...'
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Create Resume
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Completion Notice */}
          {currentStep === steps.length && isResumeComplete() && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                All Set!
              </h3>
              <p className="text-green-700">
                Your resume is complete. Click "Create Resume" to save it and open the editor
                where you can make further refinements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
