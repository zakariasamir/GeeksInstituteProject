import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const user = useSelector((state) => state.auth.user);
  return user && allowedRoles.includes(user.role) ? (
    children
  ) : (
    <Navigate to="/" />
  );
}
