'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function TailorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          AI Tailoring Coming Soon!
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          This is where the magic will happen in Phase 4. Our AI will:
        </p>

        <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-slate-700">
                Analyze your resume and the job description
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-slate-700">
                Rewrite your summary to mention the company and role
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-slate-700">
                Adjust experience bullets to highlight relevant skills
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-slate-700">
                Add ATS keywords from the job posting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-slate-700">
                Generate a personalized cover letter
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Implementation Status:</strong> Phase 3 Complete ✅
          </p>
          <p className="text-sm text-blue-800 mt-2">
            Phase 4 will integrate OpenAI GPT-4o-mini to automatically tailor your resume
            based on the job description you provided.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/job-description')} variant="outline">
            ← Back to Job Description
          </Button>
          <Button onClick={() => router.push('/resume/builder')}>
            Back to Resume Builder
          </Button>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          <p>See IMPLEMENTATION_GUIDE.md for Phase 4 details</p>
        </div>
      </div>
    </div>
  )
}
