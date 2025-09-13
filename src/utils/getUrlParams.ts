import { METHODS } from '~/constants';
import type { Header } from '~/types';
import fromBase64 from './fromBase64';

type getParamsProps = {
  method?: string;
  encodedUrl?: string;
  encodedBody?: string;
  encodedVariables?: string;
  searchParams: URLSearchParams;
};

const getParams = ({
  method,
  encodedUrl,
  encodedBody,
  encodedVariables,
  searchParams,
}: getParamsProps) => {
  const initialMethod = method
    ? (method.toUpperCase() as METHODS)
    : METHODS.GET;

  const headers: Header[] = [];
  for (const [key, value] of searchParams.entries()) {
    headers.push({ name: key, value: decodeURIComponent(value) });
  }

  const url = encodedUrl ? fromBase64(encodedUrl) : '';

  let body = '';

  if (encodedBody) {
    try {
      body = JSON.parse(fromBase64(encodedBody));
    } catch {
      body = fromBase64(encodedBody);
    }
  }

  let variables = [];
  if (encodedVariables) {
    try {
      variables = JSON.parse(fromBase64(encodedVariables));
    } catch {
      variables = [];
    }
  }

  return { initialMethod, url, body, headers, variables };
};

export default getParams;
