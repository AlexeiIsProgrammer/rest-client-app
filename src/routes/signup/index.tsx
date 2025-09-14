import { requireGuestLoader } from '../../utils/authLoaders';
import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import AuthForm from '../../components/AuthForm/AuthForm';
import { registerWithEmailAndPassword } from '../../firebase';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useLocalizedNavigate } from '~/hooks/useLocalizedNavigate';
import { useIntlayer } from 'react-intlayer';

export const loader = requireGuestLoader;

export default function SignUp() {
  const content = useIntlayer('sign-up');

  const [isFetching, setIsFetching] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useLocalizedNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      return setError(content.email?.value);
    }
    if (!validatePassword(password)) {
      return setError(content.password?.value);
    }
    try {
      setIsFetching(true);
      const user = await registerWithEmailAndPassword(email, password);
      const idToken = await user.getIdToken();
      document.cookie = `session=${idToken}; path=/; max-age=3600`;
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(content.error?.value);
      }
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <>
      {isFetching && <Spinner />}
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          {content['sign-up']}
        </Typography>
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          error={error}
          buttonText={content.register?.value}
        />
      </Container>
    </>
  );
}
