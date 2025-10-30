'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { EducationEntry } from '@/lib/types/resume'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface EducationEditorModalProps {
  isOpen: boolean
  onClose: () => void
  educationIndex: number | null
}

export function EducationEditorModal({
  isOpen,
  onClose,
  educationIndex,
}: EducationEditorModalProps) {
  const { currentResumeData, updateCurrentResume } = useResumeStore()

  const [formData, setFormData] = useState<EducationEntry>({
    degree: '',
    institution: '',
    location: '',
    graduationDate: '',
    gpa: '',
  })

  // Load existing education data when editing
  useEffect(() => {
    if (educationIndex !== null && currentResumeData?.education) {
      const existingEducation = currentResumeData.education[educationIndex]
      if (existingEducation) {
        setFormData(existingEducation)
      }
    } else {
      // Reset form for new education
      setFormData({
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
      })
    }
  }, [educationIndex, currentResumeData])

  const handleInputChange = (field: keyof EducationEntry, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!currentResumeData) return

    const updatedEducation = [...(currentResumeData.education || [])]

    if (educationIndex !== null) {
      // Update existing education
      updatedEducation[educationIndex] = formData
    } else {
      // Add new education
      updatedEducation.push(formData)
    }

    await updateCurrentResume({ education: updatedEducation })
    onClose()
  }

  const handleDelete = async () => {
    if (!currentResumeData || educationIndex === null) return

    if (confirm('Are you sure you want to delete this education entry?')) {
      const updatedEducation = currentResumeData.education?.filter(
        (_, i) => i !== educationIndex
      )
      await updateCurrentResume({ education: updatedEducation })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {educationIndex !== null ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Degree */}
          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              placeholder="e.g., Stanford University"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Stanford, CA"
            />
          </div>

          {/* Graduation Date & GPA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationDate">Graduation Date *</Label>
              <Input
                id="graduationDate"
                value={formData.graduationDate}
                onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                placeholder="e.g., May 2020"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa || ''}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {educationIndex !== null && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.degree || !formData.institution || !formData.graduationDate}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
