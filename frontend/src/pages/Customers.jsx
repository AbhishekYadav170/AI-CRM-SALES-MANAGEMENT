import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Customers() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
    assignedTo: '',
  });

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load agents for customer assignment
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await api.get('/auth/team');

        const agentList = (data.team || []).filter(
          (member) => member.role === 'agent'
        );

        setAgents(agentList);
      } catch (err) {
        console.error('Failed to load agents:', err);
        setError('Unable to load sales agents');
      } finally {
        setLoadingAgents(false);
      }
    };

    if (['admin', 'superadmin'].includes(user?.role)) {
      fetchAgents();
    }
  }, [user?.role]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || null,
      };

      const { data } = await api.post(
        '/auth/add-customer',
        payload
      );

      setMessage(
        data.message || 'Customer created successfully'
      );

      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        address: '',
        assignedTo: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create customer'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!['admin', 'superadmin'].includes(user?.role)) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">
          Access denied
        </h1>

        <p className="text-slate-500 mt-2">
          Only admins can create customers.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Add Customer
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Create a customer login account, CRM profile and assign a sales agent.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Customer Name
              </label>

              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Customer Company
              </label>

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Sales Assignment
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign Sales Agent
            </label>

            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              disabled={loadingAgents}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">
                {loadingAgents
                  ? 'Loading agents...'
                  : 'Select sales agent'}
              </option>

              {agents.map((agent) => (
                <option key={agent._id || agent.id} value={agent._id || agent.id}>
                  {agent.name} — {agent.email}
                </option>
              ))}
            </select>

            <p className="text-xs text-slate-500 mt-1">
              Agent customer ki conversations, follow-ups aur sales activities handle karega.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || loadingAgents}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {loading ? 'Creating Customer...' : 'Create Customer'}
        </button>
      </form>
    </div>
  );
}