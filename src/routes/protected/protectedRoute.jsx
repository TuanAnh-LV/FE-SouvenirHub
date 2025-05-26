import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ userRole, allowedRoles, ...rest }) => {
  return (
    <Route
      {...rest}
      element={
        allowedRoles.includes(userRole)
          ? <Component {...rest} />
          : <Navigate to= "/" />
      }
    />
  );
};

export default ProtectedRoute;
