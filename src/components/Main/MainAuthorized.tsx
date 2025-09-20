import { Container, Stack, Typography, Button } from '@mui/material';
import { useIntlayer } from 'react-intlayer';
import LocalizedLink from '../LocalizedLink';

type Props = {
  email: string;
};

function MainAuthorized({ email }: Props) {
  const content = useIntlayer('main');

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack alignItems="center" spacing={5}>
        <Typography variant="h4" gutterBottom sx={{ paddingTop: '50px' }}>
          {content.welcome}, {email}!
        </Typography>

        <Stack direction="row" spacing={5}>
          <Button component={LocalizedLink} to="/rest" variant="contained">
            {content.rest}
          </Button>
          <Button component={LocalizedLink} to="/history" variant="contained">
            {content.history}
          </Button>
          <Button component={LocalizedLink} to="/variables" variant="contained">
            {content.variables}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default MainAuthorized;
