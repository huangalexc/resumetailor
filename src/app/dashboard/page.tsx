import { verifySession } from '@/lib/dal/session'
import { redirect } from 'next/navigation'
import { signOut } from '@/../auth'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session.isAuth) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome!
              </h2>
              <p className="text-blue-700">
                You are successfully authenticated. User ID: {session.userId}
              </p>
              <p className="text-blue-700">Role: {session.role}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Resumes
                </h3>
                <p className="text-purple-700">Manage your resumes</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Profile
                </h3>
                <p className="text-green-700">Update your profile</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Settings
                </h3>
                <p className="text-amber-700">Manage your settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
