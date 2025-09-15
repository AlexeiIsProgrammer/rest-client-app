import { Navigate, Outlet } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Spinner from '../components/Spinner/Spinner';
import { VariablesProvider } from '../context/VariablesContext';

export default function PrivateRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <VariablesProvider>
      <Outlet />
    </VariablesProvider>
  );
}
