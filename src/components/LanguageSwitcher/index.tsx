import { Button } from '@mui/material';
import { getLocaleName, getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { useLocation, useNavigate } from 'react-router';

const LanguageSwitcher = () => {
  const { locale, availableLocales, setLocale } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLocaleChange = () => {
    const newLocale = availableLocales.filter((loc) => loc !== locale)[0];

    const localizedUrl = getLocalizedUrl(
      location.pathname + location.search,
      newLocale
    );

    setLocale(newLocale);
    navigate(localizedUrl);
  };

  return (
    <Button onClick={handleLocaleChange} variant="outlined" size="medium">
      Lang Toggle ({getLocaleName(locale)})
    </Button>
  );
};

export default LanguageSwitcher;
