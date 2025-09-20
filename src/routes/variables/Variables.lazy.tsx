import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useIntlayer } from 'react-intlayer';

const VariablesComponent = lazy(() => import('./index'));

const VariablesLoading = () => {
  const content = useIntlayer('variables');

  return (
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
        {content.loading}
      </Typography>
    </Box>
  );
};

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
