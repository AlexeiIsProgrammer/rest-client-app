import { type RouteConfig, layout, route } from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', [
    route('/:locale?', './routes/main/index.tsx'),
    route('/:locale?/signup', 'routes/signup/index.tsx'),
    route('/:locale?/signin', 'routes/signin/index.tsx'),
    route(
      '/:locale?/rest/:method?/:encodedUrl?/:encodedBody?',
      './routes/rest/index.tsx'
    ),
    route('/:locale?/variables', './routes/variables/index.tsx'),
    route('/:locale?/history', './routes/history/index.tsx'),
  ]),
] satisfies RouteConfig;
