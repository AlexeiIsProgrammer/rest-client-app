import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { Link, type LinkProps } from 'react-router';
import type { LocalizedLinkProps } from './types';

export default function LocalizedLink(props: LocalizedLinkProps) {
  const { locale } = useLocale();

  const isExternal = (to: string) => {
    return /^(https?:)?\/\//.test(to);
  };

  const to = isExternal(props.to)
    ? props.to
    : getLocalizedUrl(props.to, locale);

  return <Link {...props} to={to as LinkProps['to']} />;
}
