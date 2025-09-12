import { t, type Dictionary } from 'intlayer';

const pageContent = {
  key: 'page',
  content: {
    title: t({
      en: 'Welcome to React Router v7 + Intlayer',
      ru: "React Router v7 + Intlayer'a Hoş Geldiniz",
    }),
    description: t({
      en: 'Build multilingual applications with ease using React Router v7 and Intlayer.',
      ru: 'React Router v7 и Intlayer позволяют легко создавать многоязычные приложения.',
    }),
    aboutLink: t({
      en: 'Узнать о нас',
      ru: 'Hakkımızda Öğrenin',
    }),
    homeLink: t({
      en: 'Главная',
      ru: 'Ana Sayfa',
    }),
  },
} satisfies Dictionary;

export default pageContent;
