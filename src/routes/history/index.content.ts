import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'history',
  content: {
    ['error-message']: t({
      en: 'You have not executed any requests yet. It is empty here.',
      ru: 'Вы еще не выполнили ни одного запроса. Здесь пусто.',
    }),
    title: t({
      en: 'Request History',
      ru: 'История запросов',
    }),
    status: t({
      en: 'Status',
      ru: 'Статус',
    }),
    duration: t({
      en: 'Duration',
      ru: 'Продолжительность',
    }),
    ms: t({
      en: 'ms',
      ru: 'мс',
    }),
    ['request-size']: t({
      en: 'Request Size',
      ru: 'Размер запроса',
    }),
    bytes: t({
      en: 'bytes',
      ru: 'байтов',
    }),
    ['response-size']: t({
      en: 'Response Size',
      ru: 'Размер ответа',
    }),
    timestamp: t({
      en: 'Timestamp',
      ru: 'Отметка времени',
    }),
    error: t({
      en: 'Error',
      ru: 'Ошибка',
    }),
    method: t({
      en: 'Method',
      ru: 'Метод',
    }),
  },
} satisfies Dictionary;

export default pageContent;
