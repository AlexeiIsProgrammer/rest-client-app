import { expect, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import RESTClientWrapper, { loader } from '..';
import { VariablesProvider } from '~/context/VariablesContext';
import * as authServer from '~/utils/auth.server';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

const ROUTE = '/rest';

const SignInPage = () => <h1>Sign In Page</h1>;

const testRoutes = [
  {
    path: ROUTE,
    Component: RESTClientWrapper,
    loader,
  },
  {
    path: '/signin',
    Component: SignInPage,
  },
];

const renderWithProviders = (children: React.JSX.Element) =>
  render(<VariablesProvider>{children}</VariablesProvider>);

describe('/rest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders page', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });

    const TITLE = 'REST';

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    expect(
      await screen.findByRole('heading', { name: TITLE })
    ).toBeInTheDocument();
  });

  it('redirects to /signin if user not authenticated', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    expect(
      await screen.findByRole('heading', { name: /sign in page/i })
    ).toBeInTheDocument();
  });
});
