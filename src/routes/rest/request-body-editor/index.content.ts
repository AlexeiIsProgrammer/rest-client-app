import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'request-body-editor',
  content: {
    ['no-body']: t({
      en: "This HTTP method typically doesn't include a request body.",
      ru: 'Этот HTTP-метод обычно не содержит тела запроса.',
    }),
    prettify: t({
      en: 'Prettify',
      ru: 'Форматировать',
    }),
    invalid: t({
      en: 'Invalid JSON',
      ru: 'Недопустимый JSON',
    }),
    body: t({
      en: 'Request Body',
      ru: 'Тело запроса',
    }),
    ['parsed-view']: t({
      en: 'Parsed View:',
      ru: 'Обработанный вид:',
    }),
  },
} satisfies Dictionary;

export default pageContent;
