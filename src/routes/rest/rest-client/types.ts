import type { METHODS } from '~/constants';
import type { Header } from '~/types';

export type RESTClientProps = Partial<{
  initialMethod: METHODS;
  initialUrl: string;
  initialBody: string;
  initialHeaders: Header[];
}>;
