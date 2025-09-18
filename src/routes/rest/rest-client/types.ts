import type { METHODS } from '~/constants';
import type { Header, RESTResponse } from '~/types';

export type RESTClientProps = Partial<{
  initialMethod: METHODS;
  initialUrl: string;
  initialBody: string;
  initialHeaders: Header[];
  response: RESTResponse | null;
  asyncHandleSendRequest: (requestData: {
    method: string;
    url: string;
    body: string;
    headers: Header[];
  }) => void;
}>;
