'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { experienceEntrySchema, ExperienceEntryInput } from '@/lib/schemas/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/hooks/useResumeStore'

interface ExperienceFormProps {
  onNext?: () => void
  onBack?: () => void
}

export function ExperienceForm({ onNext, onBack }: ExperienceFormProps) {
  const { currentResume, addExperience, removeExperience } = useResumeStore()
  const [experiences, setExperiences] = useState(currentResume?.experience || [])
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceEntryInput>({
    resolver: zodResolver(experienceEntrySchema),
    defaultValues: {
      title: '',
      company: '',
      dates: '',
      location: '',
      bullets: [''],
    },
  })

  const onSubmit = (data: ExperienceEntryInput) => {
    // Filter out empty bullets
    const filteredBullets = data.bullets.filter((b) => b.trim() !== '')
    const experienceData = { ...data, bullets: filteredBullets }

    addExperience(experienceData)
    setExperiences([...(experiences || []), experienceData])
    reset()
    setShowForm(false)
  }

  const handleRemove = (index: number) => {
    removeExperience(index)
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <p className="text-slate-600">
          Add your work history, starting with your most recent position.
        </p>
      </div>

      {/* Existing Experiences */}
      {experiences && experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-sm text-slate-600">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.dates} | {exp.location}</p>
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
              <ul className="list-disc list-inside text-sm space-y-1">
                {exp.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Add Experience Button */}
      {!showForm && (
        <Button type="button" onClick={() => setShowForm(true)} variant="outline" className="w-full">
          + Add Experience
        </Button>
      )}

      {/* Add Experience Form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input id="title" {...register('title')} placeholder="Software Engineer" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" {...register('company')} placeholder="TechCorp" />
              {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dates">Dates *</Label>
              <Input id="dates" {...register('dates')} placeholder="Jan 2021 – Present" />
              {errors.dates && <p className="text-sm text-red-500">{errors.dates.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" {...register('location')} placeholder="San Francisco, CA" />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bullets">Key Responsibilities & Achievements *</Label>
            <Textarea
              id="bullets"
              {...register('bullets.0')}
              placeholder="• Developed scalable backend APIs using Node.js and PostgreSQL"
              className="min-h-[100px]"
            />
            {errors.bullets?.[0] && <p className="text-sm text-red-500">{errors.bullets[0].message}</p>}
            <p className="text-xs text-slate-500">
              Add one achievement per line. Use bullet points and include metrics when possible.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => {
              reset()
              setShowForm(false)
            }}>
              Cancel
            </Button>
            <Button type="submit">
              Add Experience
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
          disabled={!experiences || experiences.length === 0}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  )
}
