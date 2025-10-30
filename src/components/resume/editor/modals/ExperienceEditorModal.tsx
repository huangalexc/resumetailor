'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { ExperienceEntry } from '@/lib/types/resume'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sparkles, Plus, Trash2 } from 'lucide-react'

interface ExperienceEditorModalProps {
  isOpen: boolean
  onClose: () => void
  experienceIndex: number | null
}

export function ExperienceEditorModal({
  isOpen,
  onClose,
  experienceIndex,
}: ExperienceEditorModalProps) {
  const { currentResumeData, updateCurrentResume } = useResumeStore()

  const [formData, setFormData] = useState<ExperienceEntry>({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    achievements: [],
  })

  const [newAchievement, setNewAchievement] = useState('')

  // Load existing experience data when editing
  useEffect(() => {
    if (experienceIndex !== null && currentResumeData?.experience) {
      const existingExperience = currentResumeData.experience[experienceIndex]
      if (existingExperience) {
        setFormData(existingExperience)
      }
    } else {
      // Reset form for new experience
      setFormData({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        achievements: [],
      })
    }
  }, [experienceIndex, currentResumeData])

  const handleInputChange = (field: keyof ExperienceEntry, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), newAchievement.trim()],
      }))
      setNewAchievement('')
    }
  }

  const handleRemoveAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleUpdateAchievement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements?.map((ach, i) => (i === index ? value : ach)) || [],
    }))
  }

  const handleSave = async () => {
    if (!currentResumeData) return

    const updatedExperience = [...(currentResumeData.experience || [])]

    if (experienceIndex !== null) {
      // Update existing experience
      updatedExperience[experienceIndex] = formData
    } else {
      // Add new experience
      updatedExperience.push(formData)
    }

    await updateCurrentResume({ experience: updatedExperience })
    onClose()
  }

  const handleDelete = async () => {
    if (!currentResumeData || experienceIndex === null) return

    if (confirm('Are you sure you want to delete this experience?')) {
      const updatedExperience = currentResumeData.experience?.filter(
        (_, i) => i !== experienceIndex
      )
      await updateCurrentResume({ experience: updatedExperience })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experienceIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g., Google"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                placeholder="e.g., Jan 2020"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                value={formData.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                placeholder="e.g., Dec 2022"
                disabled={formData.currentlyWorking}
              />
            </div>
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={(e) => {
                handleInputChange('currentlyWorking', e.target.checked)
                if (e.target.checked) {
                  handleInputChange('endDate', '')
                }
              }}
              className="h-4 w-4"
            />
            <Label htmlFor="currentlyWorking" className="cursor-pointer">
              I currently work here
            </Label>
          </div>

          {/* Achievements/Responsibilities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Key Achievements & Responsibilities</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary"
                disabled
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI Enhance (Coming in Phase 3)
              </Button>
            </div>

            {/* Existing Achievements */}
            <div className="space-y-2">
              {formData.achievements?.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={achievement}
                    onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAchievement(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Achievement */}
            <div className="flex gap-2">
              <Textarea
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Describe an achievement or responsibility..."
                rows={2}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    handleAddAchievement()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddAchievement}
                disabled={!newAchievement.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to add bullet point
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {experienceIndex !== null && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.jobTitle || !formData.company || !formData.startDate}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
