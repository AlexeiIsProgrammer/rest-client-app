import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', [
    index('./routes/main/index.tsx'),
    route('/:lang', './routes/main/index.tsx', [
      route('signup', 'routes/signup/index.tsx'),
      route('signin', 'routes/signin/index.tsx'),
      layout('./routes/PrivateRoute.tsx', [
        route('rest/*', './routes/rest/index.tsx'),
        route('variables', './routes/variables/index.tsx'),
        route('history', './routes/history/index.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
