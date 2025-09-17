import { useParams, useSearchParams, useFetcher } from 'react-router';
import RESTClient from './rest-client';
import { Typography } from '@mui/material';

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

  const { url, body, initialMethod, headers } = getParams({
    method,
    encodedBody,
    encodedUrl,
    searchParams,
  });

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        REST
      </Typography>
      <RESTClient
        initialMethod={initialMethod}
        initialUrl={url}
        initialBody={body}
        initialHeaders={headers}
        response={response}
        asyncHandleSendRequest={asyncHandleSendRequest}
      />
    </>
  );
};

export default RESTClientWrapper;
