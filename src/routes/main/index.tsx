import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'Main page' },
    { name: 'description', content: 'Welcome to Main page!' },
  ];
}

export default function Main() {
  return <Container maxWidth="sm">Main</Container>;
}
