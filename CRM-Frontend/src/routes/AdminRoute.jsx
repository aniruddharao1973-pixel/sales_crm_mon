import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user || !["SUPER_ADMIN", "TSL"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}