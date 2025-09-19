import { useLoaderData } from 'react-router';
import { getUserFromRequest } from '../../utils/auth.server';
import MainNonAuthorized from '../../components/Main/MainNonAuthorized';
import MainAuthorized from '../../components/Main/MainAuthorized';
import MainCourceInfo from '../../components/Main/MainCourceInfo';

/* v8 ignore start -- @preserve */
export function meta() {
  return [
    { title: 'Main page' },
    { name: 'description', content: 'Welcome to Main page!' },
  ];
}
/* v8 ignore stop -- @preserve */

export async function loader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function Main() {
  const { user } = useLoaderData();

  return (
    <div>
      {user && user.email ? (
        <MainAuthorized email={user.email} />
      ) : (
        <MainNonAuthorized />
      )}
      <MainCourceInfo />
    </div>
  );
}
