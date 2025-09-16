import { Container, Stack, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  email: string;
};

function MainAuthorized({ email }: Props) {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack alignItems="center" spacing={5}>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: '50px' }}>
          Welcome, {email}!
        </Typography>

        <Stack direction="row" spacing={5}>
          <Button component={Link} to="/rest" variant="contained">
            Rest Client
          </Button>
          <Button component={Link} to="/history" variant="contained">
            History
          </Button>
          <Button component={Link} to="/variables" variant="contained">
            Variables
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default MainAuthorized;
