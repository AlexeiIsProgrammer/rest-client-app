import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', [
    index('./routes/main/index.tsx'),
    route('auth', './routes/auth/index.tsx', [
      route('signup', 'routes/auth/signup.tsx'),
    ]),
    route('rest', './routes/rest/index.tsx'),
    route('variables', './routes/variables/index.tsx'),
    route('history', './routes/history/index.tsx'),
  ]),
] satisfies RouteConfig;
