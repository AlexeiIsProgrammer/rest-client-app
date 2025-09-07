import { useState } from 'react';
import type { Header, RESTResponse } from '~/types';

export const useRESTClient = () => {
  const [response, setResponse] = useState<RESTResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (
    method: string,
    url: string,
    body: string,
    headers: Header[]
  ) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers.reduce(
            (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
            {}
          ),
        },
      };

      if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        try {
          options.body = JSON.stringify(JSON.parse(body));
        } catch {
          options.body = body;
          if (options.headers) {
            (options.headers as Record<string, string>)['Content-Type'] =
              'text/plain';
          }
        }
      }

      const startTime = Date.now();
      const res = await fetch(url, options);
      const responseTime = Date.now() - startTime;

      let responseData;
      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
        time: startTime,
        duration: responseTime,
      });
    } catch (error) {
      setResponse({
        error: (error as Error).message,
        time: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, sendRequest };
};
