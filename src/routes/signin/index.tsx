import { requireGuestLoader } from '../../utils/authLoaders';
import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import AuthForm from '../../components/AuthForm/AuthForm';
import { logInWithEmailAndPassword } from '../../firebase';
import { validateEmail } from '../../utils/validation';
import { useLocalizedNavigate } from '~/hooks/useLocalizedNavigate';
import LocalizedLink from '~/components/LocalizedLink';
import { useIntlayer } from 'react-intlayer';

export const loader = requireGuestLoader;

export default function SignIn() {
  const content = useIntlayer('sign-in');

  const [isFetching, setIsFetching] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useLocalizedNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      return setError('Invalid email format');
    }

    try {
      setIsFetching(true);
      const userCredential = await logInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      document.cookie = `session=${idToken}; path=/; max-age=3600`;
      navigate('/');
    } catch (err) {
      setIsFetching(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(content.error?.value);
      }
    }
  }

  return (
    <>
      {isFetching && <Spinner />}
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          {content['sign-in']}
        </Typography>
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          error={error}
          buttonText={content.login?.value}
        />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          <LocalizedLink to="/signup">{content['sign-up']}</LocalizedLink>
        </Typography>
      </Container>
    </>
  );
}
