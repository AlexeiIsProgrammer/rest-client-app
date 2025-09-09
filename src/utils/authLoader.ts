import { getUserFromRequest } from './auth.server';
import { redirect } from 'react-router';

export default async function authLoader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  if (user) {
    return redirect('/');
  }
}
