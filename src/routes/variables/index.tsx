import { Container } from '@mui/material';
import type { Route } from './+types/variables';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Variables page' },
    { name: 'description', content: 'Welcome to Variables page!' },
  ];
}

export default function Variables() {
  return <Container maxWidth="sm">Variables</Container>;
}
