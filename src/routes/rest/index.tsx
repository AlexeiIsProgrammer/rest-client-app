import { Routes, Route, useParams, useSearchParams } from 'react-router';
import RESTClient from './rest-client';
import { Alert, Box, Typography } from '@mui/material';

import { type Header } from '~/types';
import type { METHODS } from '~/constants';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

const RESTClientPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/:method?/:encodedUrl?/:encodedBody?"
        element={<RESTClientWrapper />}
      />
    </Routes>
  );
};

const RESTClientWrapper = () => {
  const { method, encodedUrl, encodedBody } = useParams();
  const [searchParams] = useSearchParams();

  try {
    const headers: Header[] = [];
    for (const [key, value] of searchParams.entries()) {
      headers.push({ name: key, value: decodeURIComponent(value) });
    }

    const url = encodedUrl ? atob(encodedUrl) : '';
    let body = '';

    if (encodedBody) {
      try {
        body = JSON.parse(atob(encodedBody));
      } catch {
        body = atob(encodedBody);
      }
    }

    return (
      <RESTClient
        initialMethod={(method as METHODS) || 'GET'}
        initialUrl={url}
        initialBody={body}
        initialHeaders={headers}
      />
    );
  } catch (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error decoding URL parameters: {(error as Error).message}
        </Alert>
        <Typography variant="body2">
          The URL appears to be malformed. Please check the format or create a
          new request.
        </Typography>
      </Box>
    );
  }
};

export default RESTClientPage;
