import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { VariablesProvider } from '~/context/VariablesContext';
import RESTClient from '..';

test('REST-client renders', async () => {
  const ROUTE = '/ru/rest';
  const TEST_ID = 'container';

  const Stub = createRoutesStub([
    {
      path: ROUTE,
      Component: RESTClient,
    },
  ]);

  render(
    <VariablesProvider>
      <Stub initialEntries={[ROUTE]} />
    </VariablesProvider>
  );

  expect(await screen.findByTestId(TEST_ID)).toBeInTheDocument();
});
