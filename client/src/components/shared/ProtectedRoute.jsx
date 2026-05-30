import { Navigate } from 'react-router-dom';

/**
 * Protected Route Component to guard dashboard routes
 */
export default function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('oneqr_current_user');
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}
