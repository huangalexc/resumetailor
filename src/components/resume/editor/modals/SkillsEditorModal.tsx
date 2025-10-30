'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SkillsEditorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SkillsEditorModal({ isOpen, onClose }: SkillsEditorModalProps) {
  const { currentResumeData, updateCurrentResume } = useResumeStore()

  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')

  // Load existing skills when modal opens
  useEffect(() => {
    if (currentResumeData?.skills) {
      setSkills([...currentResumeData.skills])
    } else {
      setSkills([])
    }
  }, [currentResumeData])

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim()
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSave = async () => {
    await updateCurrentResume({ skills })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  // Common skill suggestions
  const skillSuggestions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'Git',
    'Docker',
    'AWS',
    'Leadership',
    'Communication',
    'Problem Solving',
    'Project Management',
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Skill Input */}
          <div className="space-y-2">
            <Label htmlFor="newSkill">Add Skill</Label>
            <div className="flex gap-2">
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Current Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <Label>Your Skills ({skills.length})</Label>
              <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[100px]">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm px-3 py-1 flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skill Suggestions */}
          <div className="space-y-2">
            <Label>Common Skills (click to add)</Label>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions
                .filter((suggestion) => !skills.includes(suggestion))
                .map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      setSkills([...skills, suggestion])
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Skills</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
