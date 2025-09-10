import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const VariablesComponent = lazy(() => import('./index'));

const VariablesLoading = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: 2,
    }}
  >
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      Loading Variables...
    </Typography>
  </Box>
);

export function meta() {
  return [
    { title: 'Variables page' },
    { name: 'description', content: 'Manage your REST API variables' },
  ];
}

const Variables = () => {
  return (
    <Suspense fallback={<VariablesLoading />}>
      <VariablesComponent />
    </Suspense>
  );
};

export default Variables;
