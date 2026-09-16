import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const STAGES = [
  { key: 'prospecting', label: 'Prospecting', color: 'bg-blue-50 border-blue-200' },
  { key: 'proposal', label: 'Proposal', color: 'bg-amber-50 border-amber-200' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-50 border-orange-200' },
  { key: 'closed_won', label: 'Closed Won', color: 'bg-green-50 border-green-200' },
  { key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-50 border-red-200' },
];

function formatINR(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

export default function Deals() {
  const [board, setBoard] = useState({});
  const [totals, setTotals] = useState({ totalValue: 0, wonValue: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState(null);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/deals');
      setBoard(data.board);
      setTotals({ totalValue: data.totalValue, wonValue: data.wonValue, count: data.count });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDrop = async (stage) => {
    if (!draggedId) return;
    // Optimistic UI update — turant move dikha do, phir backend confirm karo
    setBoard((prev) => {
      const next = { ...prev };
      let moved = null;
      Object.keys(next).forEach((s) => {
        const idx = next[s].findIndex((d) => d._id === draggedId);
        if (idx !== -1) {
          moved = next[s][idx];
          next[s] = next[s].filter((d) => d._id !== draggedId);
        }
      });
      if (moved) {
        moved = { ...moved, stage };
        next[stage] = [moved, ...(next[stage] || [])];
      }
      return next;
    });
    setDraggedId(null);

    try {
      await api.put(`/deals/${draggedId}`, { stage });
      fetchDeals(); // totals refresh karne ke liye
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to move deal');
      fetchDeals();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Deal Pipeline</h1>
            <p className="text-slate-500 text-sm">Deals ko drag karke stage badlein</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs text-slate-400 uppercase">Total Deals</p>
              <p className="text-lg font-bold text-slate-800">{totals.count}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Pipeline Value</p>
              <p className="text-lg font-bold text-indigo-600">{formatINR(totals.totalValue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase">Won</p>
              <p className="text-lg font-bold text-green-600">{formatINR(totals.wonValue)}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading pipeline...</p>
        ) : (
          <div className="flex gap-4 min-w-max pb-4">
            {STAGES.map((s) => (
              <div
                key={s.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(s.key)}
                className={`w-72 rounded-xl border ${s.color} p-3 flex-shrink-0`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm text-slate-700">{s.label}</h3>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">
                    {(board[s.key] || []).length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[100px]">
                  {(board[s.key] || []).map((deal) => (
                    <div
                      key={deal._id}
                      draggable
                      onDragStart={() => setDraggedId(deal._id)}
                      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition"
                    >
                      <p className="font-medium text-sm text-slate-800">{deal.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{deal.leadId?.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-indigo-600">{formatINR(deal.value)}</span>
                        {deal.expectedCloseDate && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(deal.expectedCloseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(board[s.key] || []).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">Koi deal nahi</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
