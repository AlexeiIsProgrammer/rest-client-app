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
    projectTitle: t({
      en: 'React Final Project',
      ru: 'Финальный проект React',
    }),
    projectDescription: t({
      en: 'This app is a graduation project for the Rolling Scopes School React course. The main page provides general information about the developers, the project, and the course.',
      ru: 'Это приложение является выпускным проектом курса React от Rolling Scopes School. Главная страница содержит общую информацию о разработчиках, проекте и курсе.',
    }),
    taskSpec: t({
      en: 'Task Spec',
      ru: 'Техзадание',
    }),
    course: t({
      en: 'Course',
      ru: 'Курс',
    }),
    aboutProject: t({
      en: 'About the Project',
      ru: 'О проекте',
    }),
    projectDetails: t({
      en: 'Build a modern, production-ready React application with TypeScript, routing, state management, and robust data fetching. Include UI/UX polish, accessibility, meaningful tests, and CI-ready structure.',
      ru: 'Создайте современное, готовое к продакшену React приложение с TypeScript, маршрутизацией, управлением состоянием и надежным получением данных. Включите полировку UI/UX, доступность, значимые тесты и структуру, готовую к CI.',
    }),
    techRequirements: t({
      en: 'Tech: React + TypeScript, Router, state manager (RTK/Zustand/Context), testing, linting.',
      ru: 'Технологии: React + TypeScript, Router, менеджер состояния (RTK/Zustand/Context), тестирование, линтинг.',
    }),
    features: t({
      en: 'Features: auth (if needed), CRUD flows, pagination/filters, responsive layout.',
      ru: 'Функции: авторизация (при необходимости), CRUD потоки, пагинация/фильтры, адаптивная верстка.',
    }),
    quality: t({
      en: 'Quality: accessible components, semantic HTML, performance attention, code review readiness.',
      ru: 'Качество: доступные компоненты, семантический HTML, внимание к производительности, готовность к код-ревью.',
    }),
    deployment: t({
      en: 'Deployment: hosted build with README and links to the spec and course.',
      ru: 'Развертывание: размещенная сборка с README и ссылками на спецификацию и курс.',
    }),
    references: t({
      en: 'References:',
      ru: 'Ссылки:',
    }),
    reactFinalTask: t({
      en: 'React final task',
      ru: 'Финальное задание React',
    }),
    rsSchoolWebsite: t({
      en: 'RS School website',
      ru: 'Сайт RS School',
    }),
    aboutCourse: t({
      en: 'About the Course',
      ru: 'О курсе',
    }),
    courseDescription: t({
      en: "RS School's React track covers hooks, routing, state management (Context/Redux Toolkit/Zustand), data fetching (RTK Query / TanStack Query), testing, and Next.js basics.",
      ru: 'React трек RS School охватывает хуки, маршрутизацию, управление состоянием (Context/Redux Toolkit/Zustand), получение данных (RTK Query / TanStack Query), тестирование и основы Next.js.',
    }),
    learnMore: t({
      en: 'Learn more:',
      ru: 'Узнать больше:',
    }),
    coursePage: t({
      en: 'Course page',
      ru: 'Страница курса',
    }),
    developers: t({
      en: 'Developers',
      ru: 'Разработчики',
    }),
    developerRole: t({
      en: 'Developer',
      ru: 'Разработчик',
    }),
    developerBio: t({
      en: 'React developer working on the application for the RS School React course final project.',
      ru: 'React разработчик, работающий над приложением для финального проекта курса React от RS School.',
    }),
    linkedin: t({
      en: 'LinkedIn',
      ru: 'LinkedIn',
    }),
    aliaksandr: t({
      en: 'Aliaksandr Chachura',
      ru: 'Александр Чечура',
    }),
    alex: t({
      en: 'Alexei Shmulevtsov',
      ru: 'Алексей Шмулевцов',
    }),
    andrew: t({
      en: 'Andrei Paleshchuk',
      ru: 'Андрей Палещук',
    }),
  },
} satisfies Dictionary;

export default pageContent;
