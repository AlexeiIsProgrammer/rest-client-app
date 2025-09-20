import type { Header } from '~/types';

export type HeadersEditorProps = {
  setHeaders: React.Dispatch<React.SetStateAction<Header[]>>;
  headers: Header[];
};
