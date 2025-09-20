import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import RESTClientWrapper, { loader, action } from '..';
import { VariablesProvider } from '~/context/VariablesContext';
import * as authServer from '~/utils/auth.server';
import { sendServerRequest } from '~/routes/rest/sendServerRequest';
import { METHODS } from '~/constants';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('~/routes/rest/sendServerRequest', () => ({
  sendServerRequest: vi.fn(),
}));

const ROUTE = '/rest';
const SignInPage = () => <h1>Sign In Page</h1>;

const testRoutes = [
  {
    path: ROUTE,
    Component: RESTClientWrapper,
    loader,
    action,
  },
  {
    path: '/',
    Component: SignInPage,
  },
];

const renderWithProviders = (children: React.JSX.Element) =>
  render(<VariablesProvider>{children}</VariablesProvider>);

describe('RESTClientWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page with correct title', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);
  });

  it('redirects to / if user not authenticated', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    expect(
      await screen.findByRole('heading', { name: /sign in page/i })
    ).toBeInTheDocument();
  });

  it('loader function returns undefined when authenticated', async () => {
    const mockUser = { uid: 'user-123', email: 'test@example.com' };
    (authServer.getUserFromRequest as Mock).mockResolvedValue(mockUser);

    const request = new Request('http://localhost:3000/rest');
    const response = await loader({ request });

    expect(response).toEqual(undefined);
  });

  it('loader function redirects when not authenticated', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/rest');
    const response = await loader({ request });

    expect(response).toBeInstanceOf(Response);
    expect(response?.status).toBe(302);
    expect(response?.headers.get('Location')).toBe('/');
  });

  it('action function processes form data correctly', async () => {
    const mockResponse = {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      data: { id: 123, name: 'Test Item' },
      time: Date.now(),
      duration: 150,
    };

    (sendServerRequest as Mock).mockResolvedValue(mockResponse);

    const formData = new FormData();
    formData.append('method', METHODS.POST);
    formData.append('url', 'https://api.example.com/items');
    formData.append('body', '{"name": "Test Item"}');
    formData.append(
      'headers',
      JSON.stringify([{ name: 'Content-Type', value: 'application/json' }])
    );

    const request = new Request('http://localhost:3000/rest', {
      method: 'POST',
      body: formData,
    });

    const response = await action({ request });

    expect(sendServerRequest).toHaveBeenCalledWith(
      METHODS.POST,
      'https://api.example.com/items',
      '{"name": "Test Item"}',
      [{ name: 'Content-Type', value: 'application/json' }]
    );
    expect(response).toEqual(mockResponse);
  });

  it('action function handles invalid JSON headers gracefully', async () => {
    const formData = new FormData();
    formData.append('method', METHODS.GET);
    formData.append('url', 'https://api.example.com/users');
    formData.append('body', '');
    formData.append('headers', 'invalid-json');

    const request = new Request('http://localhost:3000/rest', {
      method: 'POST',
      body: formData,
    });

    await expect(action({ request })).rejects.toThrow();
  });
});
