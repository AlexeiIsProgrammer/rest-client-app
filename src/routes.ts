import { type RouteConfig, layout, route } from '@react-router/dev/routes';

export default [
  layout('./layout.tsx', { id: 'layout' }, [
    route('/:locale?', './routes/main/index.tsx', { id: 'main' }),
    route('/:locale?/signup', 'routes/signup/index.tsx'),
    route('/:locale?/signin', 'routes/signin/index.tsx'),
    route(
      '/:locale?/rest/:method?/:encodedUrl?/:encodedBody?/:encodedVariables?',
      './routes/rest/index.tsx'
    ),
    route('/:locale?/variables', './routes/variables/Variables.lazy.tsx'),
    route('/:locale?/history', './routes/history/index.tsx'),
  ]),
] satisfies RouteConfig;
