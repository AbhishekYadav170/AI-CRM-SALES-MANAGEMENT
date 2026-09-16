import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // User login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar allowedRoles diye gaye hain,
  // to check karo user ka role allowed hai ya nahi
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'customer') {
      return <Navigate to="/customer-portal" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}