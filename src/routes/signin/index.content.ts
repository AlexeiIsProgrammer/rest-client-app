import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'sign-in',
  content: {
    ['sign-up']: t({
      en: 'Sign up',
      ru: 'Зарегистрироваться',
    }),
    ['sign-in']: t({
      en: 'Sign in',
      ru: 'Авторизация',
    }),
    login: t({
      en: 'Login',
      ru: 'Войти',
    }),
    error: t({
      en: 'An unexpected error occurred',
      ru: 'Ой, непредвиденная ошибка, попробуйте ещё раз',
    }),
  },
} satisfies Dictionary;

export default pageContent;
