'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/hooks/useResumeStore'

const skillsSchema = z.object({
  skillsInput: z.string().min(1, 'Please add at least one skill'),
})

type SkillsInput = z.infer<typeof skillsSchema>

interface SkillsFormProps {
  onNext?: () => void
  onBack?: () => void
}

export function SkillsForm({ onNext, onBack }: SkillsFormProps) {
  const { currentResume, updateSkills } = useResumeStore()
  const [skills, setSkills] = useState<string[]>(currentResume?.skills || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsInput>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skillsInput: currentResume?.skills?.join(', ') || '',
    },
  })

  const onSubmit = (data: SkillsInput) => {
    // Split by comma and trim whitespace
    const skillsList = data.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    updateSkills(skillsList)
    setSkills(skillsList)
    onNext?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-slate-600">
          List your technical and professional skills. Separate each skill with a comma.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skillsInput">Skills *</Label>
          <Input
            id="skillsInput"
            {...register('skillsInput')}
            placeholder="JavaScript, Python, React, Node.js, AWS, Docker"
            className={errors.skillsInput ? 'border-red-500' : ''}
          />
          {errors.skillsInput && (
            <p className="text-sm text-red-500">{errors.skillsInput.message}</p>
          )}
          <p className="text-xs text-slate-500">
            Tip: Include both technical skills and relevant tools/frameworks.
          </p>
        </div>

        {/* Preview Skills as Tags */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <Label>Preview:</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
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
