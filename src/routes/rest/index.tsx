import { useParams, useSearchParams, useLoaderData } from 'react-router';
import RESTClient from './rest-client';
import { Alert, Box, Typography } from '@mui/material';

import { sendServerRequest } from '~/routes/rest/sendServerRequest';
import type { Route as RouteType } from './+types';
import getParams from '~/utils/getUrlParams';
import { getUserFromRequest } from '~/utils/auth.server';
import { redirect } from 'react-router';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export async function loader({ params, request }: RouteType.LoaderArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect('/signin');
  }

  const { searchParams } = new URL(request.url);
  const { method, encodedUrl, encodedBody, encodedVariables } = params;

  const { url, body, initialMethod, headers, variables } = getParams({
    method,
    encodedBody,
    encodedUrl,
    encodedVariables,
    searchParams,
  });

  const refererUrl = request.headers.get('Referer');

  const prevPath = refererUrl ? new URL(refererUrl).pathname : null;

  if (!url || !prevPath?.includes('/rest')) return null;

  return await sendServerRequest(initialMethod, url, body, headers, variables);
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
