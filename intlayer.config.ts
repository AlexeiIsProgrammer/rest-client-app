import { type IntlayerConfig, Locales } from 'intlayer';

const config: IntlayerConfig = {
  internationalization: {
    defaultLocale: Locales.ENGLISH,
    locales: [Locales.ENGLISH, Locales.RUSSIAN],
  },
  middleware: {
    prefixDefault: true,
  },
};

export default config;
