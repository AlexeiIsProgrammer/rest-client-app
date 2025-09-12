import { Button } from '@mui/material';
import { getLocaleName } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { useLocation, useNavigate } from 'react-router';

const LanguageSwitcher = () => {
  const { locale, availableLocales, setLocale } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLocaleChange = () => {
    const newLocale = availableLocales.filter((loc) => loc !== locale)[0];

    setLocale(newLocale);
    navigate(location.pathname + location.search);
  };

  return (
    <Button onClick={handleLocaleChange} variant="outlined" size="medium">
      Lang Toggle ({getLocaleName(locale)})
    </Button>
  );
};

export default LanguageSwitcher;
