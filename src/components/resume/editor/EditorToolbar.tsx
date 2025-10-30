'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Layout, Settings2, Save, Check, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface EditorToolbarProps {
  isSaving: boolean
  lastSaved: Date | null
  resumeId: string
}

export function EditorToolbar({ isSaving, lastSaved, resumeId }: EditorToolbarProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic')

  const formatLastSaved = (date: Date | null) => {
    if (!date) return ''

    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000) // seconds

    if (diff < 10) return 'just now'
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
  }

  const handleDownload = (format: 'pdf' | 'docx') => {
    // TODO: Implement download functionality in Phase 6
    console.log('Download as', format)
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    // TODO: Update resume template in store
    console.log('Change template to', template)
  }

  const templates = [
    { id: 'classic', name: 'Classic', description: 'Traditional single-column layout' },
    { id: 'modern', name: 'Modern', description: 'Clean two-column design' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'professional', name: 'Professional', description: 'Corporate style' },
  ]

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <Clock className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                Saved {formatLastSaved(lastSaved)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Templates Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Layout className="h-4 w-4 mr-2" />
              Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Choose Template</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium">{template.name}</span>
                  {selectedTemplate === template.id && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manage Sections Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Sections
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Manage Sections</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <span>Reorder sections</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span>Show/Hide sections</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <span>Add custom section</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Coming in Phase 6
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Download Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Download Resume</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDownload('pdf')}>
              <span>PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('docx')}>
              <span>Word (DOCX)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Coming in Phase 6
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
