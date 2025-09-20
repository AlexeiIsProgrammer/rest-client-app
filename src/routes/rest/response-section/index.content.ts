import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'response-section',
  content: {
    response: t({
      en: 'Response',
      ru: 'Ответ',
    }),
    ['no-response']: t({
      en: 'No response body',
      ru: 'Нет тела ответа',
    }),
    headers: t({
      en: 'Headers',
      ru: 'Заголовки',
    }),
    error: t({
      en: 'Error',
      ru: 'Ошибка',
    }),
  },
} satisfies Dictionary;

export default pageContent;
