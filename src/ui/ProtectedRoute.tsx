import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store';
import Loader from './Loader';

function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useSelector((state: RootState) => state.user);

  // Wait for auth check to complete before redirecting
  if (isAuthLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
