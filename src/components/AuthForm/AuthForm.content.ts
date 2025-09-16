import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'auth-form',
  content: {
    email: t({
      en: 'Email',
      ru: 'Электронная почта',
    }),
    password: t({
      en: 'Password',
      ru: 'Пароль',
    }),
  },
} satisfies Dictionary;

export default pageContent;
