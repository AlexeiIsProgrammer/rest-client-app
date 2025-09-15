import { useParams, useSearchParams, useFetcher } from 'react-router';
import RESTClient from './rest-client';
import { Alert, Box, Typography } from '@mui/material';

import { sendServerRequest } from '~/routes/rest/sendServerRequest';
import type { Route as RouteType } from './+types';
import getParams from '~/utils/getUrlParams';
import { getUserFromRequest } from '~/utils/auth.server';
import { redirect } from 'react-router';
import type { METHODS } from '~/constants';
import { useCallback } from 'react';
import type { Header } from '~/types';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export async function loader({ request }: RouteType.LoaderArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect('/signin');
  }
}

export async function action({ request }: RouteType.ActionArgs) {
  const formData = await request.formData();
  const method = formData.get('method') as METHODS;
  const url = formData.get('url') as string;
  const body = formData.get('body') as string;
  const headers = formData.get('headers') as string;

  const parsedHeaders = headers ? JSON.parse(headers) : {};

  const response = await sendServerRequest(method, url, body, parsedHeaders);
  return response;
}

const RESTClientWrapper = () => {
  const fetcher = useFetcher();
  const response = fetcher.data;

  const { method, encodedUrl, encodedBody } = useParams();
  const [searchParams] = useSearchParams();

  const asyncHandleSendRequest = useCallback(
    (requestData: {
      method: string;
      url: string;
      body: string;
      headers: Header[];
    }) => {
      fetcher.submit(
        {
          method: requestData.method,
          url: requestData.url,
          body: requestData.body,
          headers: JSON.stringify(requestData.headers),
        },
        { method: 'post' }
      );
    },
    [fetcher]
  );

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
        asyncHandleSendRequest={asyncHandleSendRequest}
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
