'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useResumeStore } from '@/hooks/useResumeStore'
import { ResumeEditorLayout } from '@/components/resume/editor/ResumeEditorLayout'
import { ResumeLivePreview } from '@/components/resume/editor/ResumeLivePreview'
import { SidebarNavigation } from '@/components/resume/editor/SidebarNavigation'
import { EditorToolbar } from '@/components/resume/editor/EditorToolbar'
import { ExperienceEditorModal } from '@/components/resume/editor/modals/ExperienceEditorModal'
import { EducationEditorModal } from '@/components/resume/editor/modals/EducationEditorModal'
import { SkillsEditorModal } from '@/components/resume/editor/modals/SkillsEditorModal'
import { SummaryEditorModal } from '@/components/resume/editor/modals/SummaryEditorModal'
import { ContactEditorModal } from '@/components/resume/editor/modals/ContactEditorModal'

export default function ResumeEditorPage() {
  const params = useParams()
  const resumeId = params.id as string

  const {
    currentResume,
    currentResumeData,
    isLoading,
    isSaving,
    lastSaved,
    error,
    fetchResume,
    enableAutoSave,
    disableAutoSave,
    clearError,
  } = useResumeStore()

  const [activeModal, setActiveModal] = useState<'experience' | 'education' | 'skills' | 'summary' | 'contact' | null>(null)
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null)
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null)

  // Fetch resume on mount
  useEffect(() => {
    if (resumeId) {
      fetchResume(resumeId)
    }
  }, [resumeId, fetchResume])

  // Enable auto-save
  useEffect(() => {
    if (currentResume) {
      enableAutoSave(currentResume.id)
    }

    return () => {
      disableAutoSave()
    }
  }, [currentResume, enableAutoSave, disableAutoSave])

  // Handle modal open for experience
  const openExperienceModal = (index?: number) => {
    setEditingExperienceIndex(index !== undefined ? index : null)
    setActiveModal('experience')
  }

  // Handle modal open for education
  const openEducationModal = (index?: number) => {
    setEditingEducationIndex(index !== undefined ? index : null)
    setActiveModal('education')
  }

  // Handle modal close
  const closeModal = () => {
    setActiveModal(null)
    setEditingExperienceIndex(null)
    setEditingEducationIndex(null)
  }

  if (isLoading && !currentResumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Resume</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              clearError()
              fetchResume(resumeId)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!currentResumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Resume Not Found</h2>
          <p className="text-muted-foreground">The resume you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <ResumeEditorLayout
      sidebar={<SidebarNavigation />}
      toolbar={
        <EditorToolbar
          isSaving={isSaving}
          lastSaved={lastSaved}
          resumeId={resumeId}
        />
      }
      preview={
        <ResumeLivePreview
          resumeData={currentResumeData}
          onEditExperience={openExperienceModal}
          onEditEducation={openEducationModal}
          onEditSkills={() => setActiveModal('skills')}
          onEditSummary={() => setActiveModal('summary')}
          onEditContact={() => setActiveModal('contact')}
        />
      }
    >
      {/* Modals */}
      {activeModal === 'experience' && (
        <ExperienceEditorModal
          isOpen={true}
          onClose={closeModal}
          experienceIndex={editingExperienceIndex}
        />
      )}

      {activeModal === 'education' && (
        <EducationEditorModal
          isOpen={true}
          onClose={closeModal}
          educationIndex={editingEducationIndex}
        />
      )}

      {activeModal === 'skills' && (
        <SkillsEditorModal isOpen={true} onClose={closeModal} />
      )}

      {activeModal === 'summary' && (
        <SummaryEditorModal isOpen={true} onClose={closeModal} />
      )}

      {activeModal === 'contact' && (
        <ContactEditorModal isOpen={true} onClose={closeModal} />
      )}
    </ResumeEditorLayout>
  )
}
