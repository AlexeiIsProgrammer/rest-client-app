import type { METHODS } from '~/constants';

export type MethodSelectorProps = {
  method: METHODS;
  setMethod: React.Dispatch<React.SetStateAction<METHODS>>;
};
