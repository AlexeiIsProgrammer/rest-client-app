import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'headers-editor',
  content: {
    request: t({
      en: 'Request Headers',
      ru: 'Заголовки запросов',
    }),
    name: t({
      en: 'Header name',
      ru: 'Имя заголовка',
    }),
    value: t({
      en: 'Header value',
      ru: 'Значение заголовка',
    }),
    add: t({
      en: 'Add Header',
      ru: 'Добавить заголовок',
    }),
  },
} satisfies Dictionary;

export default pageContent;
