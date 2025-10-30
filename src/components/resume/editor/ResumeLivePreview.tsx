'use client'

import { ResumeData } from '@/lib/types/resume'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MapPin, Linkedin, Globe, Plus, Pencil } from 'lucide-react'

interface ResumeLivePreviewProps {
  resumeData: Partial<ResumeData> | null
  onEditExperience: (index?: number) => void
  onEditEducation: (index?: number) => void
  onEditSkills: () => void
  onEditSummary: () => void
  onEditContact: () => void
}

export function ResumeLivePreview({
  resumeData,
  onEditExperience,
  onEditEducation,
  onEditSkills,
  onEditSummary,
  onEditContact,
}: ResumeLivePreviewProps) {
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No resume data available</p>
      </div>
    )
  }

  const { contactInfo, summary, experience = [], education = [], skills = [] } = resumeData

  return (
    <Card className="bg-white shadow-lg p-12 max-w-[8.5in] mx-auto">
      {/* Contact Info Section */}
      <section className="group relative mb-8 hover:bg-muted/30 p-4 rounded-md transition-colors cursor-pointer"
        onClick={onEditContact}
      >
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onEditContact()
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            {contactInfo?.name || 'Your Name'}
          </h1>

          {contactInfo && (
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {contactInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {contactInfo.email}
                </span>
              )}
              {contactInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {contactInfo.phone}
                </span>
              )}
              {contactInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {contactInfo.location}
                </span>
              )}
              {contactInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </span>
              )}
              {contactInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Website
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Professional Summary Section */}
      <section
        className="group relative mb-8 hover:bg-muted/30 p-4 rounded-md transition-colors cursor-pointer"
        onClick={onEditSummary}
      >
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onEditSummary()
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-bold mb-3 pb-2 border-b-2 border-primary">
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          {summary || 'Add a professional summary to introduce yourself...'}
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold pb-2 border-b-2 border-primary flex-1">
            Work Experience
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditExperience()}
            className="ml-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {experience.length === 0 ? (
          <div
            className="text-center py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => onEditExperience()}
          >
            <p className="text-sm text-muted-foreground">
              Click to add your first work experience
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="group relative hover:bg-muted/30 p-4 rounded-md transition-colors cursor-pointer"
                onClick={() => onEditExperience(index)}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditExperience(index)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-foreground/90">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold pb-2 border-b-2 border-primary flex-1">
            Education
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditEducation()}
            className="ml-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {education.length === 0 ? (
          <div
            className="text-center py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => onEditEducation()}
          >
            <p className="text-sm text-muted-foreground">
              Click to add your education
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="group relative hover:bg-muted/30 p-4 rounded-md transition-colors cursor-pointer"
                onClick={() => onEditEducation(index)}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditEducation(index)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {edu.institution}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {edu.graduationDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section
        className="group relative hover:bg-muted/30 p-4 rounded-md transition-colors cursor-pointer"
        onClick={onEditSkills}
      >
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onEditSkills()
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-bold mb-3 pb-2 border-b-2 border-primary">
          Skills
        </h2>

        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Click to add your skills...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>
    </Card>
  )
}
