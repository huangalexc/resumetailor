'use client'

import { ReactNode } from 'react'

interface ResumeEditorLayoutProps {
  sidebar: ReactNode
  toolbar: ReactNode
  preview: ReactNode
  children?: ReactNode
}

export function ResumeEditorLayout({
  sidebar,
  toolbar,
  preview,
  children,
}: ResumeEditorLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - File Navigation */}
      <aside className="w-64 border-r border-border bg-card flex-shrink-0 overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <header className="border-b border-border bg-card">
          {toolbar}
        </header>

        {/* Resume Preview */}
        <main className="flex-1 overflow-y-auto bg-muted p-8">
          <div className="max-w-4xl mx-auto">
            {preview}
          </div>
        </main>
      </div>

      {/* Modals and Overlays */}
      {children}
    </div>
  )
}
