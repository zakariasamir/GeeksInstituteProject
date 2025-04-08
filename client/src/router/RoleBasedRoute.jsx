import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles, children }) {
  const { user } = useSelector((state) => state.auth);
  console.log("User from Redux:", user);
  console.log("Allowed Roles:", allowedRoles);
  if (!user || allowedRoles.includes(user.role) === false) {
    return <Navigate to="/" />;
  }
  return children;
  // return user && allowedRoles.includes(user.role) ? (
  //   children
  // ) : (
  //   <Navigate to="/" />
  // );
}
