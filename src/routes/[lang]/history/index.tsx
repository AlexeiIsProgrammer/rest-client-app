import { requireAuthLoader } from '../../../utils/authLoaders';
import { Container } from '@mui/material';

export function meta() {
  return [
    { title: 'History page' },
    { name: 'description', content: 'Welcome to History page!' },
  ];
}

export const loader = requireAuthLoader;

export default function History() {
  return <Container maxWidth="sm">History</Container>;
}
