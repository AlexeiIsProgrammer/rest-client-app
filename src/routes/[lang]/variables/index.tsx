import { requireAuthLoader } from '../../../utils/authLoaders';
import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'Variables page' },
    { name: 'description', content: 'Welcome to Variables page!' },
  ];
}

export const loader = requireAuthLoader;

export default function Variables() {
  return <Container maxWidth="sm">Variables</Container>;
}
