import { Container } from '@mui/material';
import type { Route } from './+types/rest';

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export default function Rest() {
  return <Container maxWidth="sm">Rest</Container>;
}
