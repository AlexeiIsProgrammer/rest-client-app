import { t, type Dictionary } from 'intlayer';

const componentContent = {
  key: 'component-key',
  content: {
    myTranslatedContent: t({
      en: 'Hello World',
      ru: 'Привет, Мир!',
    }),
  },
} satisfies Dictionary;

export default componentContent;
