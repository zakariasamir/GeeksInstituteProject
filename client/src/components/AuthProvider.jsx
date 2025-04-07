import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../redux/slices/authSlice';

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
}