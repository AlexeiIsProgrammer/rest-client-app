import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import AuthForm from '../../components/AuthForm/AuthForm';
import { logInWithEmailAndPassword, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { validateEmail } from '../../utils/validation';
import { useNavigate, Link, Navigate } from 'react-router';

export default function SignIn() {
  const [user, loading] = useAuthState(auth);
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
      await logInWithEmailAndPassword(email, password);
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

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
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
          <Link to="/signup">Sign up</Link>
        </Typography>
      </Container>
    </>
  );
}
