import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store';

function AdminRoute() {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
}

export default AdminRoute;
