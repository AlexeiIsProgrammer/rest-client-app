export enum LANGUAGES {
  'curl' = 'curl',
  'javascript-fetch' = 'javascript-fetch',
  'javascript-xhr' = 'javascript-xhr',
  'nodejs' = 'nodejs',
  'python' = 'python',
  'java' = 'java',
  'csharp' = 'csharp',
  'go' = 'go',
}

export const LANGUAGE_OPTIONS = Object.keys(LANGUAGES).filter((key) =>
  isNaN(Number(key))
);

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export const METHODS_OPTIONS = Object.keys(METHODS).filter((key) =>
  isNaN(Number(key))
);
