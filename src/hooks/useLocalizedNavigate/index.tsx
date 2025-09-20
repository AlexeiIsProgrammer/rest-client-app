import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { useNavigate, type NavigateOptions } from 'react-router';

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const isExternal = (to: string) => {
    return /^(https?:)?\/\//.test(to);
  };

  const localizedNavigate = (to: string, options?: NavigateOptions) => {
    const localedTo = isExternal(to) ? to : getLocalizedUrl(to, locale);

    navigate(localedTo, options);
  };

  return localizedNavigate;
};
