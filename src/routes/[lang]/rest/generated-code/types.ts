import type { METHODS } from '~/constants';
import type { Header } from '~/types';

export type GeneratedCodeProps = {
  method: METHODS;
  url: string;
  body: string;
  headers: Header[];
};
