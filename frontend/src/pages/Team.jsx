import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Team() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/team');
      setTeam(data.team);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/auth/add-agent', form);
      setForm({ name: '', email: '', password: '', phone: '' });
      setShowForm(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add agent');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Team</h1>
            <p className="text-slate-500 text-sm">Apni company ke admin aur sales agents</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              {showForm ? 'Cancel' : '+ Add Agent'}
            </button>
          )}
        </div>

        {!isAdmin && (
          <div className="bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded-lg mb-6">
            Sirf admin naye agents add kar sakta hai. Aap yahan sirf team list dekh sakte hain.
          </div>
        )}

        {showForm && isAdmin && (
          <form onSubmit={handleAddAgent} className="bg-white border border-slate-200 rounded-xl p-6 mb-6 space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Agent's Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                required
                type="password"
                minLength={6}
                placeholder="Password (kam se kam 6 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add Agent'}
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500 text-sm">Loading team...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member._id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-800">{member.name}</td>
                    <td className="px-5 py-3 text-slate-600">{member.email}</td>
                    <td className="px-5 py-3 text-slate-600">{member.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        member.role === 'admin' || member.role === 'superadmin'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
