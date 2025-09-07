import RESTClient from './rest-client';

export function meta() {
  return [
    { title: 'Rest page' },
    { name: 'description', content: 'Welcome to Rest page!' },
  ];
}

export default function Rest() {
  return (
    <RESTClient
      // initialMethod={method || 'GET'}
      // initialUrl={url}
      initialBody='{"foo":1}'
      // initialHeaders={headers}
    />
  );
}
