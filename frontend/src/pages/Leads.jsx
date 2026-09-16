// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import api from '../services/api';

// const statusColors = {
//   new: 'bg-blue-100 text-blue-700',
//   contacted: 'bg-amber-100 text-amber-700',
//   qualified: 'bg-purple-100 text-purple-700',
//   negotiation: 'bg-orange-100 text-orange-700',
//   won: 'bg-green-100 text-green-700',
//   lost: 'bg-red-100 text-red-700',
// };

// export default function Leads() {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState('');
//   const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'manual', budget: '' });
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   const fetchLeads = async (query = '') => {
//     setLoading(true);
//     try {
//       const { data } = await api.get(`/leads${query ? `?search=${query}` : ''}`);
//       setLeads(data.leads);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchLeads(search);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSaving(true);
//     try {
//       await api.post('/leads', form);
//       setForm({ name: '', phone: '', email: '', source: 'manual', budget: '' });
//       setShowForm(false);
//       fetchLeads();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create lead');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
//             <p className="text-slate-500 text-sm">Apne saare leads yahan manage karein</p>
//           </div>
//           <button
//             onClick={() => setShowForm((s) => !s)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
//           >
//             {showForm ? 'Cancel' : '+ Add Lead'}
//           </button>
//         </div>

//         {showForm && (
//           <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-6 mb-6 space-y-4">
//             {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</div>}
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 required
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 required
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//               <select
//                 value={form.source}
//                 onChange={(e) => setForm({ ...form, source: e.target.value })}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="manual">Manual</option>
//                 <option value="website">Website</option>
//                 <option value="whatsapp">WhatsApp</option>
//                 <option value="facebook">Facebook</option>
//                 <option value="referral">Referral</option>
//               </select>
//               <input
//                 placeholder="Budget (e.g. ₹50,000 - ₹1,00,000)"
//                 value={form.budget}
//                 onChange={(e) => setForm({ ...form, budget: e.target.value })}
//                 className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={saving}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
//             >
//               {saving ? 'Saving...' : 'Save Lead'}
//             </button>
//           </form>
//         )}

//         <form onSubmit={handleSearch} className="mb-4">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, phone or email..."
//             className="w-full max-w-sm border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </form>

//         <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//           {loading ? (
//             <p className="p-6 text-slate-500 text-sm">Loading leads...</p>
//           ) : leads.length === 0 ? (
//             <p className="p-6 text-slate-500 text-sm">Koi lead nahi mila. "+ Add Lead" se naya banayein.</p>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
//                 <tr>
//                   <th className="text-left px-5 py-3">Name</th>
//                   <th className="text-left px-5 py-3">Phone</th>
//                   <th className="text-left px-5 py-3">Source</th>
//                   <th className="text-left px-5 py-3">Status</th>
//                   <th className="text-left px-5 py-3">AI Score</th>
//                   <th className="text-left px-5 py-3"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leads.map((lead) => (
//                   <tr key={lead._id} className="border-t border-slate-100 hover:bg-slate-50">
//                     <td className="px-5 py-3 font-medium text-slate-800">{lead.name}</td>
//                     <td className="px-5 py-3 text-slate-600">{lead.phone}</td>
//                     <td className="px-5 py-3 text-slate-600 capitalize">{lead.source}</td>
//                     <td className="px-5 py-3">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
//                         {lead.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3">
//                       {lead.aiScore !== null ? (
//                         <span className={`font-semibold ${lead.aiScore >= 7 ? 'text-green-600' : lead.aiScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
//                           {lead.aiScore}/10
//                         </span>
//                       ) : (
//                         <span className="text-slate-400">—</span>
//                       )}
//                     </td>
//                     <td className="px-5 py-3 text-right">
//                       <Link to={`/leads/${lead._id}`} className="text-indigo-600 font-medium hover:underline">
//                         View →
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-purple-100 text-purple-700',
  negotiation: 'bg-orange-100 text-orange-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function Leads() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'manual', budget: '', assignedTo: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/leads${query ? `?search=${query}` : ''}`);
      setLeads(data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const { data } = await api.get('/auth/team');
      setTeam(data.team);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
    if (isAdmin) fetchTeam();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(search);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.assignedTo) delete payload.assignedTo; // khali ho to backend khud current user assign karega
      await api.post('/leads', payload);
      setForm({ name: '', phone: '', email: '', source: 'manual', budget: '', assignedTo: '' });
      setShowForm(false);
      fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
            <p className="text-slate-500 text-sm">Apne saare leads yahan manage karein</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            {showForm ? 'Cancel' : '+ Add Lead'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-6 mb-6 space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="manual">Manual</option>
                <option value="website">Website</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="referral">Referral</option>
              </select>
              <input
                placeholder="Budget (e.g. ₹50,000 - ₹1,00,000)"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
              />

              {/* Sirf admin/superadmin ko yeh dropdown dikhta hai — agent hamesha khud ko hi assign hota hai */}
              {isAdmin && (
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                >
                  <option value="">Assign To — Myself (default)</option>
                  {team.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Lead'}
            </button>
          </form>
        )}

        <form onSubmit={handleSearch} className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full max-w-sm border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="p-6 text-slate-500 text-sm">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">Koi lead nahi mila. "+ Add Lead" se naya banayein.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Phone</th>
                  <th className="text-left px-5 py-3">Source</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Assigned To</th>
                  <th className="text-left px-5 py-3">AI Score</th>
                  <th className="text-left px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-800">{lead.name}</td>
                    <td className="px-5 py-3 text-slate-600">{lead.phone}</td>
                    <td className="px-5 py-3 text-slate-600 capitalize">{lead.source}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{lead.assignedTo?.name || '—'}</td>
                    <td className="px-5 py-3">
                      {lead.aiScore !== null ? (
                        <span className={`font-semibold ${lead.aiScore >= 7 ? 'text-green-600' : lead.aiScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                          {lead.aiScore}/10
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/leads/${lead._id}`} className="text-indigo-600 font-medium hover:underline">
                        View →
                      </Link>
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
