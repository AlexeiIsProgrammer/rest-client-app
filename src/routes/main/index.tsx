import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import Spinner from '../../components/Spinner/Spinner';
import MainNonAuthorized from '../../components/Main/MainNonAuthorized';
import MainAuthorized from '../../components/Main/MainAuthorized';

export function meta() {
  return [
    { title: 'Main page' },
    { name: 'description', content: 'Welcome to Main page!' },
  ];
}

export default function Main() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Spinner />;
  }

  if (user && user.email) {
    return <MainAuthorized email={user.email} />;
  } else {
    return <MainNonAuthorized />;
  }
}
