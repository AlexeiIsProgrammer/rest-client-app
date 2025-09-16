import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'rest',
  content: {
    ['error-header']: t({
      en: 'URL parsing error',
      ru: 'Ошибка декодирования URL параметров',
    }),
    ['error-body']: t({
      en: 'The URL appears to be malformed. Please check the format or create a new request.',
      ru: 'URL-адрес, по-видимому, неправильно сформирован. Пожалуйста, проверьте формат или создайте новый запрос.',
    }),
  },
} satisfies Dictionary;

export default pageContent;
