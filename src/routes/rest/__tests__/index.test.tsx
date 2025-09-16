import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import RESTClientWrapper from '..';
import { VariablesProvider } from '~/context/VariablesContext';

test('REST renders', () => {
  const ROUTE = '/ru/rest';
  const TITLE = 'REST';

  const Stub = createRoutesStub([
    {
      path: ROUTE,
      Component: RESTClientWrapper,
    },
  ]);

  render(
    <VariablesProvider>
      <Stub initialEntries={[ROUTE]} />
    </VariablesProvider>
  );

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
