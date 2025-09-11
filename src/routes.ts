import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', [
    index('./routes/index.tsx'),
    route('/:lang', './routes/[lang]/main/index.tsx'),
    route('/:lang/signup', 'routes/[lang]/signup/index.tsx'),
    route('/:lang/signin', 'routes/[lang]/signin/index.tsx'),
    route('/:lang/rest/*', './routes/[lang]/rest/index.tsx'),
    route('/:lang/variables', './routes/[lang]/variables/index.tsx'),
    route('/:lang/history', './routes/[lang]/history/index.tsx'),
  ]),
] satisfies RouteConfig;
