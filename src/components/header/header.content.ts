import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'header',
  content: {
    ['sign-in']: t({
      en: 'Sign in',
      ru: 'Войти',
    }),
    ['sign-up']: t({
      en: 'Sign up',
      ru: 'Зарегистрироваться',
    }),
    logout: t({
      en: 'Main',
      ru: 'Главная',
    }),
    home: t({
      en: 'Go to home',
      ru: 'На главную',
    }),
    logo: t({
      en: 'Logo',
      ru: 'Логотип',
    }),
  },
} satisfies Dictionary;

export default pageContent;
