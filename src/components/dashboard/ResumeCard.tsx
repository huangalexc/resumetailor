'use client'

import { Resume } from '@prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FileText, Edit, Copy, Trash2, MoreVertical, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/hooks/useResumeStore'

interface ResumeCardProps {
  resume: Resume
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const { duplicateResumeById, deleteResumeById } = useResumeStore()

  const resumeData = JSON.parse(resume.data)
  const resumeName = resumeData.contactInfo?.name || 'Untitled Resume'

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return new Date(date).toLocaleDateString()
  }

  const handleDuplicate = async () => {
    const duplicate = await duplicateResumeById(resume.id)
    if (duplicate) {
      router.push(`/dashboard/resumes/${duplicate.id}/edit`)
    }
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${resumeName}"? This action cannot be undone.`)) {
      await deleteResumeById(resume.id)
      router.refresh()
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/resumes/${resume.id}/edit`)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{resumeName}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Updated {formatDate(resume.updatedAt)}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {resumeData.experience && resumeData.experience.length > 0 && (
            <p>
              {resumeData.experience.length} work {resumeData.experience.length === 1 ? 'experience' : 'experiences'}
            </p>
          )}
          {resumeData.education && resumeData.education.length > 0 && (
            <p>
              {resumeData.education.length} education {resumeData.education.length === 1 ? 'entry' : 'entries'}
            </p>
          )}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <p>{resumeData.skills.length} skills listed</p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleEdit} className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Resume
        </Button>
      </CardFooter>
    </Card>
  )
}
