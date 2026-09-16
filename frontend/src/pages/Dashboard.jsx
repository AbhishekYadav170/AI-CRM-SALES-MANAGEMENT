import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/leads/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusCount = (status) =>
    stats?.breakdown?.find((b) => b._id === status)?.count || 0;

  const cards = [
    { label: 'Total Leads', value: stats?.total || 0, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'New', value: statusCount('new'), color: 'bg-blue-50 text-blue-700' },
    { label: 'Contacted', value: statusCount('contacted'), color: 'bg-amber-50 text-amber-700' },
    { label: 'Qualified', value: statusCount('qualified'), color: 'bg-purple-50 text-purple-700' },
    { label: 'Won', value: statusCount('won'), color: 'bg-green-50 text-green-700' },
    { label: 'Lost', value: statusCount('lost'), color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mb-8">Yahan aapke leads ka overview hai</p>

        {loading ? (
          <p className="text-slate-500">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((c) => (
              <div key={c.label} className={`rounded-xl p-5 ${c.color}`}>
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs font-medium mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-2">Next Steps</h2>
          <p className="text-sm text-slate-500">
            "Leads" tab pe jaake naya lead add karein, AI se chat simulate karein, aur lead ko score karwaein.
          </p>
        </div>
      </main>
    </div>
  );
}
