import { Outlet } from 'react-router';
import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'Auth page' },
    { name: 'description', content: 'Welcome to Auth page!' },
  ];
}

export default function Auth() {
  return (
    <>
      <Container maxWidth="sm">Auth</Container>
      <Outlet />
    </>
  );
}
