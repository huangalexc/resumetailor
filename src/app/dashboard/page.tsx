import { verifySession } from '@/lib/dal/session'
import { redirect } from 'next/navigation'
import { signOut } from '@/../auth'
import { getUserResumes, getResumeStats } from '@/app/actions/resume.actions'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Download, Settings, LogOut, Crown } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session.isAuth) {
    redirect('/login')
  }

  // Fetch user's resumes and stats
  const resumesResult = await getUserResumes()
  const statsResult = await getResumeStats()

  const resumes = resumesResult.success ? resumesResult.data : []
  const stats = statsResult.success ? statsResult.data : { totalResumes: 0, totalApplications: 0, recentActivity: null }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-slate-900">ResumeTailor</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <Button variant="ghost" size="icon" type="submit">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Resumes</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Applications</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Last Updated</p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.recentActivity
                    ? new Date(stats.recentActivity).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Resumes</h2>
            <Link href="/resume/builder">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-slate-600 mb-6">
                Get started by creating your first resume
              </p>
              <Link href="/resume/builder">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
