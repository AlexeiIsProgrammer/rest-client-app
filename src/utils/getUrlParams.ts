import { METHODS } from '~/constants';
import type { Header } from '~/types';

type getParamsProps = {
  method?: string;
  encodedUrl?: string;
  encodedBody?: string;
  searchParams: URLSearchParams;
};

const getParams = ({
  method,
  encodedUrl,
  encodedBody,
  searchParams,
}: getParamsProps) => {
  const initialMethod = method
    ? (method.toUpperCase() as METHODS)
    : METHODS.GET;

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

  return { initialMethod, url, body, headers };
};

export default getParams;
