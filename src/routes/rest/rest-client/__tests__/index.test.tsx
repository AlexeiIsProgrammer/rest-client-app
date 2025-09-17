import { expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { VariablesProvider } from '~/context/VariablesContext';
import RESTClient from '..';

const ROUTE = '/rest';
const testRoutes = [
  {
    path: ROUTE,
    Component: () => <RESTClient />,
  },
];

const renderWithProviders = (children: React.JSX.Element) =>
  render(<VariablesProvider>{children}</VariablesProvider>);

describe('REST client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders page', async () => {
    const TEST_ID = 'container';

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    expect(await screen.findByTestId(TEST_ID)).toBeInTheDocument();
  });
});
