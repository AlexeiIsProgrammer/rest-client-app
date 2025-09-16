import { METHODS } from '~/constants';
import type { Header } from '~/types';

const getHttpErrorMessage = (status: number, statusText: string): string => {
  switch (status) {
    case 400:
      return 'Bad Request - The server could not understand the request. Please check your request format.';
    case 401:
      return 'Unauthorized - Authentication required. Please check your credentials.';
    case 403:
      return 'Forbidden - You do not have permission to access this resource.';
    case 404:
      return 'Not Found - The requested resource was not found. Please check your URL.';
    case 405:
      return 'Method Not Allowed - The HTTP method is not supported for this endpoint.';
    case 408:
      return 'Request Timeout - The server timed out waiting for the request.';
    case 429:
      return 'Too Many Requests - Rate limit exceeded. Please try again later.';
    case 500:
      return 'Internal Server Error - The server encountered an unexpected error.';
    case 502:
      return 'Bad Gateway - The server received an invalid response from upstream.';
    case 503:
      return 'Service Unavailable - The server is temporarily unavailable.';
    case 504:
      return 'Gateway Timeout - The server did not receive a timely response.';
    default:
      return statusText || 'Unknown error occurred';
  }
};

export const sendServerRequest = async (
  method: METHODS,
  url: string,
  body: string | unknown,
  headers: Header[]
) => {
  try {
    const processedUrl = url;

    let bodyString = body;
    if (typeof body === 'object' && body !== null) {
      bodyString = JSON.stringify(body);
    }
    const processedBody = bodyString;

    const processedHeaders = headers;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...processedHeaders.reduce(
          (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
          {} as Record<string, string>
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
        options.body = JSON.stringify(JSON.parse(String(processedBody)));
      } catch {
        options.body = String(processedBody);
        if (options.headers) {
          (options.headers as Record<string, string>)['Content-Type'] =
            'text/plain';
        }
      }
    }

    try {
      new URL(processedUrl);
    } catch {
      throw new Error(
        `Invalid URL: ${processedUrl}`
      );
    }

    const startTime = Date.now();
    const res = await fetch(processedUrl, options);
    const responseTime = Date.now() - startTime;

    let responseData;
    const contentType = res.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      const errorMessage = getHttpErrorMessage(res.status, res.statusText);
      throw new Error(`HTTP ${res.status}: ${errorMessage}`);
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      data: responseData,
      time: startTime,
      duration: responseTime,
    };
  } catch (error) {
    console.error('sendServerRequest - Error details:', error);

    let errorMessage = 'Unknown error occurred';

    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage =
        'Network error: Unable to connect to the server. Please check your internet connection and try again.';
    } else if (
      error instanceof Error &&
      error.message.includes('Invalid URL')
    ) {
      errorMessage =
        'Invalid URL: The URL format is incorrect. Please check your endpoint URL.';
    } else if (
      error instanceof Error &&
      error.message.includes('Failed to substitute')
    ) {
      errorMessage = `Variable substitution failed: ${error.message}`;
    } else if (
      error instanceof Error &&
      error.message.includes('Failed to parse URL')
    ) {
      errorMessage =
        'URL parsing failed: The URL contains invalid characters or format.';
    } else if (error instanceof Error && error.message.includes('HTTP')) {
      errorMessage = error.message;
    } else {
      errorMessage = `Request failed: ${(error as Error).message}`;
    }

    return {
      status: 0,
      statusText: 'Error',
      headers: {},
      data: undefined,
      time: Date.now(),
      duration: 0,
      error: errorMessage,
    };
  }
};
