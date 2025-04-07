import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, roleRequired, redirectTo }) => {
  const { user } = useSelector(state => state.auth);
  
  if (!user || user.role !== roleRequired) {
    return <Navigate to={redirectTo} />;
  }
  
  return children;
};

export default RoleRoute;