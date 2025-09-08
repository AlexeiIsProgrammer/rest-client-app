import { useState, useRef, useEffect } from 'react';
import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  Link,
} from 'react-router-dom';

import { logInWithEmailAndPassword } from '../../firebase';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import Spinner from '../../components/Spinner/Spinner';
import { validateEmail } from '../../utils/validation';

import { adminAuth } from '../../firebaseAdmin.server';

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const idToken = formData.get('idToken') as string;

  if (!idToken) {
    return { error: 'ID Token is missing' };
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 дней

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `session=${sessionCookie}; Max-Age=${expiresIn / 1000}; Path=/;`
    );

    return redirect('/', { headers });
  } catch (error) {
    console.error('Cookie error:', error);
    return { error: 'Error creating session cookie.' };
  }
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const actionData = useActionData() as { error?: string };

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [idToken, setIdToken] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (idToken && formRef.current) {
      formRef.current.submit();
    }
  }, [idToken]);

  const handleLoginClick = async () => {
    setClientError(null);

    if (!validateEmail(email)) {
      return setClientError('Invalid email format');
    }

    try {
      const userCredential = await logInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      setIdToken(token);
    } catch (err) {
      setClientError('Email or password is incorrect');
      console.error(err);
    }
  };
  return (
    <>
      {isSubmitting && <Spinner />}
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>

        <Form method="post" ref={formRef}>
          <input type="hidden" name="idToken" value={idToken} />
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {(clientError || actionData?.error) && (
              <Alert severity="error">{clientError || actionData.error}</Alert>
            )}

            <Button
              type="button"
              onClick={handleLoginClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              <Link to="/signup">Sign up</Link>
            </Typography>
          </Box>
        </Form>
      </Container>
    </>
  );
}

// import { useState } from 'react';
// import { Container, Typography } from '@mui/material';
// import Spinner from '../../components/Spinner/Spinner';
// import AuthForm from '../../components/AuthForm/AuthForm';
// import { logInWithEmailAndPassword, auth } from '../../firebase';
// // import { useAuthState } from 'react-firebase-hooks/auth';
// import { validateEmail } from '../../utils/validation';
// import { useNavigate, Link, Navigate } from 'react-router';

// export default function SignIn() {
//   // const [user, loading] = useAuthState(auth);
//   console.log('begin');
//   const [isFetching, setIsFetching] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   async function handleSubmit(e: React.FormEvent) {
//     console.log('submit');
//     e.preventDefault();
//     if (!validateEmail(email)) {
//       return setError('Invalid email format');
//     }

//     try {
//       setIsFetching(true);
//       await logInWithEmailAndPassword(email, password);
//       navigate('/');
//     } catch (err) {
//       setIsFetching(false);
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unexpected error occurred');
//       }
//     }
//   }

//   // if (loading) {
//   //   return <Spinner />;
//   // }

//   // if (user) {
//   //   return <Navigate to="/" replace />;
//   // }

//   return (
//     <>
//       {isFetching && <Spinner />}
//       <Container maxWidth="sm">
//         <Typography variant="h4" gutterBottom>
//           Sign In
//         </Typography>
//         <AuthForm
//           email={email}
//           setEmail={setEmail}
//           password={password}
//           setPassword={setPassword}
//           handleSubmit={handleSubmit}
//           error={error}
//           buttonText="Login"
//         />
//         <Typography sx={{ mt: 2, textAlign: 'center' }}>
//           <Link to="/signup">Sign up</Link>
//         </Typography>
//       </Container>
//     </>
//   );
// }
