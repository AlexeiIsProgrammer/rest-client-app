import { Container } from '@mui/material';
import ExistingVariables from './existing-variables/ExistingVariables';

export function meta() {
  return [
    { title: 'Variables page' },
    { name: 'description', content: 'Manage your REST API variables' },
  ];
}

function Variables() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <ExistingVariables />
    </Container>
  );
}

export default Variables;
