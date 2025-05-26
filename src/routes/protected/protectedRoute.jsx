import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorize" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
