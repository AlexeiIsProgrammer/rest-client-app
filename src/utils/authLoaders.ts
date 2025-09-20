import { getUserFromRequest } from './auth.server';
import { redirect } from 'react-router';

export async function requireGuestLoader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  if (user) {
    return redirect('/');
  }
}

export async function requireAuthLoader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect('/');
  }
  return user;
}
