import { Container, Stack, Typography, Button } from '@mui/material';
import { useIntlayer } from 'react-intlayer';
import { Link } from 'react-router';

function MainNonAuthorized() {
  const content = useIntlayer('main');

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack alignItems="center" spacing={5}>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: '50px' }}>
          {content.welcome}!
        </Typography>

        <Stack direction="row" spacing={5}>
          <Button component={Link} to="/signin" variant="contained">
            {content['sign-in']}
          </Button>
          <Button component={Link} to="/signup" variant="contained">
            {content['sign-up']}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default MainNonAuthorized;
