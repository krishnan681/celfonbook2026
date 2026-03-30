import { Navigate } from "react-router-dom";
import { useAuth } from "../../../core/context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;