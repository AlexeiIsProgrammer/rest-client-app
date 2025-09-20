import type { METHODS } from '~/constants';

export type RequestBodyEditorProps = {
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  method: METHODS;
};
