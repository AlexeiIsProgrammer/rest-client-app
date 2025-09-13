import { useState } from 'react';
import { METHODS } from '~/constants';
import type { Header, RESTResponse } from '~/types';
import {
  substituteVariables,
  loadVariablesFromStorage,
} from '~/utils/variableStorage';

export const useRESTClient = (userId: string) => {
  const [response, setResponse] = useState<RESTResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (
    method: METHODS,
    url: string,
    body: string,
    headers: Header[]
  ) => {
    setLoading(true);
    try {
      const variables = loadVariablesFromStorage(userId);

      const processedBody = substituteVariables(body, variables);

      const processedHeaders = headers.map((header) => ({
        name: substituteVariables(header.name, variables),
        value: substituteVariables(header.value, variables),
      }));

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...processedHeaders.reduce(
            (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
            {}
          ),
        },
      };

      if (
        processedBody &&
        [METHODS.POST, METHODS.PUT, METHODS.PATCH, METHODS.DELETE].includes(
          method
        )
      ) {
        try {
          options.body = JSON.stringify(JSON.parse(processedBody));
        } catch {
          options.body = processedBody;
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

      const restResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
        time: startTime,
        duration: responseTime,
      };
      setResponse(restResponse);
      return restResponse;
    } catch (error) {
      const errorResponse = {
        error: (error as Error).message,
        time: Date.now(),
      };
      setResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, sendRequest };
};
