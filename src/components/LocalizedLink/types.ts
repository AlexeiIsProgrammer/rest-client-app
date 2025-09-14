import type { LinkProps } from 'react-router';

export type LocalizedLinkProps = {
  to: string;
} & Omit<LinkProps, 'to'>;
