import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "../redux/slices/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
