import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'main',
  content: {
    welcome: t({
      en: 'Welcome',
      ru: 'Добро пожаловать',
    }),
    rest: t({
      en: 'Rest Client',
      ru: 'REST клиент',
    }),
    history: t({
      en: 'History',
      ru: 'История',
    }),
    variables: t({
      en: 'Variables',
      ru: 'Переменные',
    }),
    ['sign-in']: t({
      en: 'Sign in',
      ru: 'Войти',
    }),
    ['sign-up']: t({
      en: 'Sign up',
      ru: 'Регистрация',
    }),
  },
} satisfies Dictionary;

export default pageContent;
