import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check both user and token exist
  if (!user || !token) {
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;