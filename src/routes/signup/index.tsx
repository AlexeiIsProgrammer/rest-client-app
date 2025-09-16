import { requireGuestLoader } from '../../utils/authLoaders';
import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import AuthForm from '../../components/AuthForm/AuthForm';
import { registerWithEmailAndPassword } from '../../firebase';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';

export const loader = requireGuestLoader;

export default function SignUp() {
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
    if (!validatePassword(password)) {
      return setError(
        'Password must be at least 8 characters, include a letter, a number, and a special character'
      );
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
        setError('An unexpected error occurred');
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
          Sign Up
        </Typography>
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          error={error}
          buttonText="Register"
        />
      </Container>
    </>
  );
}
