import { useLoaderData } from 'react-router';
import { getUserFromRequest } from '../../utils/auth.server';
// import Spinner from '../../components/Spinner/Spinner';
import MainNonAuthorized from '../../components/Main/MainNonAuthorized';
import MainAuthorized from '../../components/Main/MainAuthorized';

export function meta() {
  return [
    { title: 'Main page' },
    { name: 'description', content: 'Welcome to Main page!' },
  ];
}

export async function loader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function Main() {
  const { user } = useLoaderData();

  if (user && user.email) {
    return <MainAuthorized email={user.email} />;
  } else {
    return <MainNonAuthorized />;
  }
}
