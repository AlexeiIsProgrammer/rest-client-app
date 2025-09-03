import { Container } from '@mui/material';
import type { Route } from './+types/auth';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Auth page' },
    { name: 'description', content: 'Welcome to Auth page!' },
  ];
}

export default function Auth() {
  return <Container maxWidth="sm">Auth</Container>;
}
