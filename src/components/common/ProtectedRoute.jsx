import { useAuth } from "../../contexts/AuthContext";
import PermissionDeniedPage from "../../pages/PermissionDeniedPage";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!user) return <PermissionDeniedPage />;
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.role)) return <PermissionDeniedPage />;
    } else {
      if (user.role !== requiredRole) return <PermissionDeniedPage />;
    }
  }

  return children;
}