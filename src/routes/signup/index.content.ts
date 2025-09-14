import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'sign-up',
  content: {
    ['sign-up']: t({
      en: 'Sign up',
      ru: 'Регистрация',
    }),
    register: t({
      en: 'Register',
      ru: 'Зарегистрироваться',
    }),
    error: t({
      en: 'An unexpected error occurred',
      ru: 'Ой, непредвиденная ошибка, попробуйте ещё раз',
    }),
    password: t({
      en: 'Password must be at least 8 characters, include a letter, a number, and a special character',
      ru: 'Пароль должен содержать минимум 8 символов, включая буквы, цифры, и специальные символы',
    }),
    email: t({
      en: 'Invalid email format',
      ru: 'Неверный формат электронной почты',
    }),
  },
} satisfies Dictionary;

export default pageContent;
