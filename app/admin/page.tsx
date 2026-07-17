import { supabaseMain } from '@/lib/supabase'

export default async function AdminPage() {
  const { data: users } = await supabaseMain
    .from('users')
    .select('*')
    .order('createdAt', { ascending: false })

  const { data: leadsRaw } = await supabaseMain
    .from('leads')
    .select('*')
    .order('createdAt', { ascending: false })

  const { data: bidsRaw } = await supabaseMain
    .from('bids')
    .select('*, lead:leads(*)')
    .order('createdAt', { ascending: false })

  const userMap = new Map((users || []).map((u: any) => [u.id, u]))

  const leads = (leadsRaw || []).map((lead: any) => ({
    ...lead,
    author: userMap.get(lead.authorId) || null
  }))

  const bids = (bidsRaw || []).map((bid: any) => ({
    ...bid,
    seller: userMap.get(bid.sellerId) || null
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{users?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Leads</h3>
          <p className="text-3xl font-bold">{leads?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Bids</h3>
          <p className="text-3xl font-bold">{bids?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Username</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Credits</th>
                <th className="px-6 py-3 font-semibold">Company / Verified</th>
                <th className="px-6 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(users || []).slice(0, 10).map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'seller' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.credits}</td>
                  <td className="px-6 py-4">{user.companyName || '-'} {user.isVerified ? '✅' : ''}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt!).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
