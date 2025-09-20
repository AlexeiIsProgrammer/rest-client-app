import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'generated-code',
  content: {
    language: t({
      en: 'Language',
      ru: 'Язык',
    }),
    select: t({
      en: '// Select a language to generate code',
      ru: '// Выберите язык для генерации кода',
    }),
  },
} satisfies Dictionary;

export default pageContent;
