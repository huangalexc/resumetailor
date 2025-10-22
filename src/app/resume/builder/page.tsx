'use client'

import { useState } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { ClassicTemplate } from '@/components/resume/templates/ClassicTemplate'
import { ContactInfoForm } from '@/components/resume/forms/ContactInfoForm'
import { SummaryForm } from '@/components/resume/forms/SummaryForm'
import { ExperienceForm } from '@/components/resume/forms/ExperienceForm'
import { EducationForm } from '@/components/resume/forms/EducationForm'
import { SkillsForm } from '@/components/resume/forms/SkillsForm'
import { Button } from '@/components/ui/button'

const steps = [
  { id: 1, name: 'Contact Info', component: ContactInfoForm },
  { id: 2, name: 'Summary', component: SummaryForm },
  { id: 3, name: 'Experience', component: ExperienceForm },
  { id: 4, name: 'Education', component: EducationForm },
  { id: 5, name: 'Skills', component: SkillsForm },
]

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { currentResume } = useResumeStore()

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

  const isResumeComplete = () => {
    return (
      currentResume?.contactInfo &&
      currentResume?.summary &&
      currentResume?.experience &&
      currentResume.experience.length > 0 &&
      currentResume?.education &&
      currentResume.education.length > 0 &&
      currentResume?.skills &&
      currentResume.skills.length > 0
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Build Your Resume</h1>
          <p className="text-slate-600 mt-2">
            Fill in each section step-by-step. Your progress is automatically saved.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form Section */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep === step.id
                          ? 'bg-blue-600 text-white'
                          : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep > step.id ? '✓' : step.id}
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        currentStep === step.id
                          ? 'text-blue-600 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {CurrentFormComponent && (
                <CurrentFormComponent
                  onNext={handleNext}
                  onBack={currentStep > 1 ? handleBack : undefined}
                />
              )}
            </div>

            {/* Complete Resume Button */}
            {currentStep === steps.length && isResumeComplete() && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Resume Complete!
                </h3>
                <p className="text-green-700 mb-4">
                  Your resume is ready. You can now tailor it to a job description or download it.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg">
                    Tailor to Job
                  </Button>
                  <Button size="lg" variant="outline">
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Live Preview</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 overflow-auto max-h-[800px]">
                {currentResume && isResumeComplete() ? (
                  <ClassicTemplate data={currentResume as any} variant="web" />
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-lg font-semibold mb-2">
                      Preview will appear here
                    </p>
                    <p className="text-sm">
                      Fill in the forms to see your resume take shape
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
