import { TextField, Button, Typography } from '@mui/material';

type Props = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  buttonText: string;
};

function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  error,
  buttonText,
}: Props) {
  return (
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
        {buttonText}
      </Button>
    </form>
  );
}

export default AuthForm;
