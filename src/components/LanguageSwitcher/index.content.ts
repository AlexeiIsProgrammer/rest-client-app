import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'language-switcher',
  content: {
    name: t({
      en: 'Toggle language',
      ru: 'Сменить язык',
    }),
  },
} satisfies Dictionary;

export default pageContent;
