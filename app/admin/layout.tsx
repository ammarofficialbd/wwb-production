import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  
  // Strict admin check
  if (!session || session.role !== 'admin') {
    // Return 404 to completely mask the admin panel from the public
    redirect('/404')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">WWB</div>
          <span className="font-extrabold text-xl">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">{session.username}</span>
        </div>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
