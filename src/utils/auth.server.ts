import { adminAuth } from '../firebaseAdmin.server';

export async function getUserFromRequest(request: Request) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;

  const idToken = match[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (err) {
    console.error('Auth error:', err);
    return null;
  }
}
