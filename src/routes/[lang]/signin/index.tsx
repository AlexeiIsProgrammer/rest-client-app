import { requireGuestLoader } from '../../../utils/authLoaders';
import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Spinner from '../../../components/Spinner/Spinner';
import AuthForm from '../../../components/AuthForm/AuthForm';
import { logInWithEmailAndPassword } from '../../../firebase';
import { validateEmail } from '../../../utils/validation';
import { useNavigate } from 'react-router';
import LocaleLink from '~/components/LocaleLink';

export const loader = requireGuestLoader;

export default function SignIn() {
  const [isFetching, setIsFetching] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        setError('An unexpected error occurred');
      }
    }
  }

  return (
    <>
      {isFetching && <Spinner />}
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          error={error}
          buttonText="Login"
        />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          <LocaleLink to="/signup">Sign up</LocaleLink>
        </Typography>
      </Container>
    </>
  );
}
