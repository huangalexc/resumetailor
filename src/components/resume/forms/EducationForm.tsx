'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationEntrySchema, EducationEntryInput } from '@/lib/schemas/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/hooks/useResumeStore'

interface EducationFormProps {
  onNext?: () => void
  onBack?: () => void
}

export function EducationForm({ onNext, onBack }: EducationFormProps) {
  const { currentResume, addEducation, removeEducation } = useResumeStore()
  const [educations, setEducations] = useState(currentResume?.education || [])
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationEntryInput>({
    resolver: zodResolver(educationEntrySchema),
  })

  const onSubmit = (data: EducationEntryInput) => {
    addEducation(data)
    setEducations([...(educations || []), data])
    reset()
    setShowForm(false)
  }

  const handleRemove = (index: number) => {
    removeEducation(index)
    setEducations(educations.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Education</h2>
        <p className="text-slate-600">
          Add your educational background.
        </p>
      </div>

      {/* Existing Education */}
      {educations && educations.length > 0 && (
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-sm text-slate-600">{edu.school}</p>
                  <p className="text-xs text-slate-500">{edu.dates}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Education Button */}
      {!showForm && (
        <Button type="button" onClick={() => setShowForm(true)} variant="outline" className="w-full">
          + Add Education
        </Button>
      )}

      {/* Add Education Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-6 bg-white">
          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Input id="degree" {...register('degree')} placeholder="B.S. in Computer Science" />
            {errors.degree && <p className="text-sm text-red-500">{errors.degree.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School/University *</Label>
            <Input id="school" {...register('school')} placeholder="Massachusetts Institute of Technology" />
            {errors.school && <p className="text-sm text-red-500">{errors.school.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dates">Graduation Date *</Label>
            <Input id="dates" {...register('dates')} placeholder="2015 – 2019" />
            {errors.dates && <p className="text-sm text-red-500">{errors.dates.message}</p>}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => {
              reset()
              setShowForm(false)
            }}>
              Cancel
            </Button>
            <Button type="submit">
              Add Education
            </Button>
          </div>
        </form>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {onBack && (
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          className="flex-1"
          onClick={onNext}
          disabled={!educations || educations.length === 0}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  )
}
