'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/hooks/useResumeStore'

const summarySchema = z.object({
  summary: z
    .string()
    .min(50, 'Summary must be at least 50 characters')
    .max(500, 'Summary must be less than 500 characters'),
})

type SummaryInput = z.infer<typeof summarySchema>

interface SummaryFormProps {
  onNext?: () => void
  onBack?: () => void
}

export function SummaryForm({ onNext, onBack }: SummaryFormProps) {
  const { currentResume, updateSummary } = useResumeStore()
  const [charCount, setCharCount] = useState(currentResume?.summary?.length || 0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SummaryInput>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: currentResume?.summary || '',
    },
  })

  // Watch summary field for character count
  const summaryValue = watch('summary')
  if (summaryValue && summaryValue.length !== charCount) {
    setCharCount(summaryValue.length)
  }

  const onSubmit = (data: SummaryInput) => {
    updateSummary(data.summary)
    onNext?.()
  }

  const getCharCountColor = () => {
    if (charCount < 50) return 'text-red-500'
    if (charCount > 500) return 'text-red-500'
    if (charCount > 450) return 'text-yellow-600'
    return 'text-slate-600'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Professional Summary</h2>
        <p className="text-slate-600">
          Write a brief summary highlighting your experience, skills, and career goals. This appears at the top of your resume.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="summary">Summary *</Label>
            <span className={`text-sm ${getCharCountColor()}`}>
              {charCount} / 500 characters
            </span>
          </div>
          <Textarea
            id="summary"
            {...register('summary')}
            placeholder="Example: Experienced software engineer with 5+ years of full-stack development expertise. Passionate about building scalable applications and mentoring junior developers."
            className={`min-h-[150px] ${errors.summary ? 'border-red-500' : ''}`}
            maxLength={500}
          />
          {errors.summary && (
            <p className="text-sm text-red-500">{errors.summary.message}</p>
          )}
          <p className="text-xs text-slate-500">
            Tip: Mention your years of experience, key skills, and what makes you unique.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {onBack && (
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1">
          Save & Continue
        </Button>
      </div>
    </form>
  )
}
