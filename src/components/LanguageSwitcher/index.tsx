import { Button } from '@mui/material';
import { getLocaleName, getLocalizedUrl, Locales } from 'intlayer';
import { useIntlayer, useLocale } from 'react-intlayer';
import { useLocation } from 'react-router';

const LanguageSwitcher = () => {
  const { name } = useIntlayer('language-switcher');

  const { pathname, search } = useLocation();

  const { locale, setLocale } = useLocale({
    onLocaleChange: (newLocale) => {
      const pathWithLocale = getLocalizedUrl(pathname + search, newLocale);

      location.replace(pathWithLocale);
    },
  });

  const handleLocaleChange = () => {
    setLocale(locale === Locales.RUSSIAN ? Locales.ENGLISH : Locales.RUSSIAN);
  };

  return (
    <Button onClick={handleLocaleChange} variant="outlined" size="medium">
      {name} ({getLocaleName(locale)})
    </Button>
  );
};

export default LanguageSwitcher;
