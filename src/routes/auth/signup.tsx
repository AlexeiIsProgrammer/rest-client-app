import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import { registerWithEmailAndPassword } from '../../firebase';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useNavigate } from 'react-router';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      await registerWithEmailAndPassword(email, password);
      navigate('/rest');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Spinner />}
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Container>
    </>
  );
}
