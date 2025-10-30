'use client'

import { useState, useEffect } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sparkles, Lightbulb } from 'lucide-react'

interface SummaryEditorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SummaryEditorModal({ isOpen, onClose }: SummaryEditorModalProps) {
  const { currentResumeData, updateCurrentResume } = useResumeStore()

  const [summary, setSummary] = useState('')
  const characterCount = summary.length
  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length

  // Load existing summary when modal opens
  useEffect(() => {
    if (currentResumeData?.summary) {
      setSummary(currentResumeData.summary)
    } else {
      setSummary('')
    }
  }, [currentResumeData])

  const handleSave = async () => {
    await updateCurrentResume({ summary: summary.trim() })
    onClose()
  }

  const summaryTips = [
    'Keep it concise: 3-4 sentences or 50-100 words',
    'Highlight your top 2-3 qualifications or achievements',
    'Use action verbs and quantifiable results',
    'Tailor it to the job you\'re applying for',
    'Include relevant keywords from the job description',
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Professional Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Professional Summary</Label>
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
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a compelling summary of your professional background, key skills, and career objectives. Focus on what makes you unique and valuable to potential employers."
              rows={8}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{characterCount} characters</span>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>Tips for a Great Summary</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground pl-6">
              {summaryTips.map((tip, index) => (
                <li key={index} className="list-disc">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Example Section */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Example:</p>
            <p className="text-sm text-muted-foreground italic">
              "Results-driven software engineer with 5+ years of experience building scalable web
              applications. Specialized in React and Node.js with a proven track record of delivering
              high-impact projects that increased user engagement by 40%. Passionate about creating
              intuitive user experiences and mentoring junior developers."
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!summary.trim()}>
            Save Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
