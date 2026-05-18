import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, sellerOnly = false, clientOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-library-200 border-t-library-500 rounded-full animate-spin" />
          <p className="text-ink-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (sellerOnly && user.role !== 'seller' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (clientOnly && user.role !== 'client') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;