'use client'

import Link from 'next/link'
import { ClassicTemplate } from '@/components/resume/templates/ClassicTemplate'
import { ResumeData } from '@/lib/types/resume'
import { Button } from '@/components/ui/button'

// Sample resume data for demonstration
const sampleResume: ResumeData = {
  contactInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
  },
  summary:
    'Experienced software engineer with 5+ years of full-stack development expertise. Passionate about building scalable applications and mentoring junior developers.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      dates: 'Jan 2021 – Present',
      location: 'Remote',
      bullets: [
        'Developed scalable backend APIs using Node.js and PostgreSQL, serving 1M+ daily active users',
        'Reduced API response times by 40% through caching and query optimization',
        'Led migration from monolith to microservices architecture',
        'Mentored 3 junior engineers and conducted code reviews',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      dates: 'Jun 2019 – Dec 2020',
      location: 'San Francisco, CA',
      bullets: [
        'Built React components for dashboard with 50K+ monthly users',
        'Implemented authentication and authorization using JWT',
        'Collaborated with design team to improve user experience',
        'Reduced bug count by 30% through comprehensive testing',
      ],
    },
  ],
  education: [
    {
      school: 'Massachusetts Institute of Technology',
      degree: 'B.S. in Computer Science',
      dates: '2015 – 2019',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Git',
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Resume Tailor
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            AI-powered resume tailoring and cover letter generation. Transform your resume for any job in under 2 minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/resume/builder">
              <Button size="lg" className="text-lg px-8">
                Start Building Resume
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold mb-2">Structured Builder</h3>
            <p className="text-slate-600">
              Fill in structured fields for contact info, experience, education, and skills. No formatting needed.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Tailoring</h3>
            <p className="text-slate-600">
              Paste a job description and our AI rewrites your resume to match the role requirements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-semibold mb-2">ATS-Friendly</h3>
            <p className="text-slate-600">
              Single-column, parseable format ensures your resume passes Applicant Tracking Systems.
            </p>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Preview: ATS-Safe Classic Template
          </h2>
          <ClassicTemplate data={sampleResume} variant="web" />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-600">
          <p className="text-sm">
            Built with Next.js, Prisma, OpenAI, and Tailwind CSS
          </p>
          <p className="text-xs mt-2">
            See <code className="bg-slate-200 px-2 py-1 rounded">IMPLEMENTATION_GUIDE.md</code> for development roadmap
          </p>
        </div>
      </div>
    </div>
  )
}
