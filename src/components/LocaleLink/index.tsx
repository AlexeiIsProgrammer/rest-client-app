import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { Link } from 'react-router';
import type { LinkProps } from 'react-router';

export default function LocaleLink({ to, ...props }: LinkProps) {
  const { locale } = useLocale();

  const localizedTo =
    typeof to === 'string'
      ? getLocalizedUrl(to, locale)
      : { ...to, pathname: getLocalizedUrl(to.pathname || '', locale) };

  return <Link to={localizedTo} {...props} />;
}
