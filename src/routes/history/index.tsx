import { redirect } from 'react-router';
import { getUserFromRequest } from '../../utils/auth.server';
import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'History page' },
    { name: 'description', content: 'Welcome to History page!' },
  ];
}

export async function loader({ request }: { request: Request }) {
  const user = await getUserFromRequest(request);

  if (!user) {
    throw redirect('/signin');
  }
}

export default function History() {
  return <Container maxWidth="sm">History</Container>;
}
