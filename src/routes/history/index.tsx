import { Container } from '@mui/material';
import type { Route } from './+types/history';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'History page' },
    { name: 'description', content: 'Welcome to History page!' },
  ];
}

export default function History() {
  return <Container maxWidth="sm">History</Container>;
}
