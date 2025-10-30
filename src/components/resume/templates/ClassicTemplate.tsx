import { ResumeData } from '@/lib/types/resume'
import { cn } from '@/lib/utils'

interface ClassicTemplateProps {
  data: ResumeData
  variant?: 'web' | 'pdf'
  className?: string
}

export function ClassicTemplate({ data, variant = 'web', className }: ClassicTemplateProps) {
  return (
    <div
      className={cn(
        'bg-white text-black font-sans',
        variant === 'web' && 'max-w-[8.5in] mx-auto p-12 shadow-lg',
        variant === 'pdf' && 'w-full p-8',
        className
      )}
    >
      {/* Header - Contact Information */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-black mb-1">
          {data.contactInfo.name}
        </h1>
        <p className="text-sm text-gray-600">
          {data.contactInfo.email} | {data.contactInfo.phone} | {data.contactInfo.location}
        </p>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-black pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-base leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-black pb-1">
            EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-base font-bold text-black">
                {exp.title} — {exp.company}
              </h3>
              <p className="text-sm italic text-gray-600 mb-2">
                {exp.dates} | {exp.location}
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-base leading-snug">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-black pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-base font-bold text-black">{edu.degree}</h3>
              <p className="text-sm text-gray-700">
                {edu.school} | {edu.dates}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-black pb-1">
            SKILLS
          </h2>
          <p className="text-base leading-relaxed">{data.skills.join(', ')}</p>
        </section>
      )}
    </div>
  )
}
