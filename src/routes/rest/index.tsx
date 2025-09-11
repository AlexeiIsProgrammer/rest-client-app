import { useParams, useSearchParams, useLoaderData } from 'react-router';
import RESTClient from './rest-client';
import { Alert, Box, Typography } from '@mui/material';

import { sendServerRequest } from '~/hooks/useRESTClient/sendServerRequest';
import type { Route as RouteType } from './+types';
import getParams from '~/utils/getUrlParams';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export async function loader({ params, request }: RouteType.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const { method, encodedUrl, encodedBody } = params;

  const { url, body, initialMethod, headers } = getParams({
    method,
    encodedBody,
    encodedUrl,
    searchParams,
  });

  if (!url) return null;

  return await sendServerRequest(initialMethod, url, body, headers);
}

const RESTClientWrapper = () => {
  const response = useLoaderData<typeof loader>();

  const { method, encodedUrl, encodedBody } = useParams();
  const [searchParams] = useSearchParams();

  try {
    const { url, body, initialMethod, headers } = getParams({
      method,
      encodedBody,
      encodedUrl,
      searchParams,
    });

    return (
      <RESTClient
        initialMethod={initialMethod}
        initialUrl={url}
        initialBody={body}
        initialHeaders={headers}
        response={response}
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

export default RESTClientWrapper;
