// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function Sidebar() {
//   const { user, company, logout } = useAuth();
//   const navigate = useNavigate();

//   const linkClass = ({ isActive }) =>
//     `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
//       isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
//     }`;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col">
//       <div className="p-5 border-b border-slate-200">
//         <h1 className="font-bold text-lg text-slate-800">🤖 AI CRM</h1>
//         <p className="text-xs text-slate-500 truncate">{company?.name || 'Your Business'}</p>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         <NavLink to="/dashboard" className={linkClass}>📊 Dashboard</NavLink>
//         <NavLink to="/leads" className={linkClass}>🧑‍💼 Leads</NavLink>
//         <NavLink to="/deals" className={linkClass}>🤝 Deals</NavLink>
//         <NavLink to="/team" className={linkClass}>👥 Team</NavLink>
//       </nav>

//       <div className="p-4 border-t border-slate-200">
//         <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
//         <p className="text-xs text-slate-500 mb-3 truncate">{user?.role}</p>
//         <button
//           onClick={handleLogout}
//           className="w-full text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg py-2 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }



import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCustomer = user?.role === 'customer';
  const isAdmin = ['admin', 'superadmin'].includes(user?.role);
  const isAgent = user?.role === 'agent';

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <h1 className="font-bold text-lg text-slate-800">
          🤖 AI CRM
        </h1>

        <p className="text-xs text-slate-500 truncate">
          {company?.name || 'Your Business'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* CUSTOMER */}
        {isCustomer && (
          <NavLink to="/customer-portal" className={linkClass}>
            🏠 Customer Portal
          </NavLink>
        )}

        {/* ADMIN / AGENT */}
        {!isCustomer && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              📊 Dashboard
            </NavLink>

            <NavLink to="/leads" className={linkClass}>
              🧑‍💼 Leads
            </NavLink>

            {/* Customers - Admin only */}
            {isAdmin && (
              <NavLink to="/customers" className={linkClass}>
                👤 Customers
              </NavLink>
            )}

            <NavLink to="/deals" className={linkClass}>
              🤝 Deals
            </NavLink>

            {/* Team - Admin only */}
            {isAdmin && (
              <NavLink to="/team" className={linkClass}>
                👥 Team
              </NavLink>
            )}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-700 truncate">
          {user?.name}
        </p>

        <p className="text-xs text-slate-500 mb-3 truncate capitalize">
          {user?.role}
        </p>

        <button
          onClick={handleLogout}
          className="w-full text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg py-2 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}