'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DocumentType = 'resumes' | 'cover-letters'

export function SidebarNavigation() {
  const router = useRouter()
  const params = useParams()
  const currentResumeId = params.id as string

  const { resumes, fetchResumes, duplicateResumeById, deleteResumeById } = useResumeStore()
  const [activeTab, setActiveTab] = useState<DocumentType>('resumes')

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  const handleDuplicate = async (resumeId: string) => {
    const duplicate = await duplicateResumeById(resumeId)
    if (duplicate) {
      router.push(`/dashboard/resumes/${duplicate.id}/edit`)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      await deleteResumeById(resumeId)
      if (resumeId === currentResumeId) {
        router.push('/dashboard')
      }
    }
  }

  const handleCreateNew = () => {
    router.push('/resume/builder')
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="p-4 border-b border-border">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="cover-letters" disabled>
              Cover Letters
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Resume List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'resumes' && (
          <div className="p-2 space-y-1">
            {resumes.length === 0 ? (
              <div className="text-center py-8 px-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No resumes yet</p>
              </div>
            ) : (
              resumes.map((resume) => {
                const resumeData = JSON.parse(resume.data)
                const isActive = resume.id === currentResumeId

                return (
                  <div
                    key={resume.id}
                    className={`group relative rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Link
                      href={`/dashboard/resumes/${resume.id}/edit`}
                      className="flex items-start p-3 pr-10"
                    >
                      <FileText className="h-4 w-4 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {resumeData.contactInfo?.name || 'Untitled Resume'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDuplicate(resume.id)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(resume.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'cover-letters' && (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">Cover letters coming soon</p>
          </div>
        )}
      </div>

      {/* Create New Button */}
      <div className="p-4 border-t border-border">
        <Button onClick={handleCreateNew} className="w-full" variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
    </div>
  )
}
