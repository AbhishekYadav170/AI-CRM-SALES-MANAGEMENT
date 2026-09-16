// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Leads from './pages/Leads';
// import LeadDetail from './pages/LeadDetail';
// import Deals from './pages/Deals';
// import Team from './pages/Team';
// import CustomerPortal from './pages/CustomerPortal';

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/leads"
//             element={
//               <ProtectedRoute>
//                 <Leads />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/leads/:id"
//             element={
//               <ProtectedRoute>
//                 <LeadDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/deals" element={ <ProtectedRoute> <Deals /> </ProtectedRoute> } />
//           <Route path="/team" element={ <ProtectedRoute> <Team /> </ProtectedRoute> } />
//           <Route
//                path="/customer-portal"
//                element={
//                   <ProtectedRoute>
//                       <CustomerPortal />
//                   </ProtectedRoute>
//                 }
//            />

//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Deals from "./pages/Deals";
import Team from "./pages/Team";
import CustomerPortal from "./pages/CustomerPortal";
import Customers from "./pages/Customers";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* CRM Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin", "agent"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Leads */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin", "agent"]}>
                <Leads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin", "agent"]}>
                <LeadDetail />
              </ProtectedRoute>
            }
          />

          {/* Deals */}
          <Route
            path="/deals"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin", "agent"]}>
                <Deals />
              </ProtectedRoute>
            }
          />

          {/* Team - Admin Only */}
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <Team />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <Customers />
              </ProtectedRoute>
            }
          />

          {/* Customer Portal - Customer Only */}
          <Route
            path="/customer-portal"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerPortal />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
