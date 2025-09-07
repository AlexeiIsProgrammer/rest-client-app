import { Container, Stack, Typography, Button } from '@mui/material';
import { Link } from 'react-router';

function MainNonAuthorized() {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack alignItems="center" spacing={5}>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: '50px' }}>
          Welcome!
        </Typography>

        <Stack direction="row" spacing={5}>
          <Button component={Link} to="/signin" variant="contained">
            Sign in
          </Button>
          <Button component={Link} to="/signup" variant="contained">
            Sign up
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default MainNonAuthorized;
