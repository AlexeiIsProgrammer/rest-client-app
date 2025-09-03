import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export default function Rest() {
  return <Container maxWidth="sm">Rest</Container>;
}
