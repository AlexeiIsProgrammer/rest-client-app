import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import RESTClientWrapper, { loader, action } from '..';
import { VariablesProvider } from '~/context/VariablesContext';
import * as authServer from '~/utils/auth.server';
import { sendServerRequest } from '~/routes/rest/sendServerRequest';
import { METHODS } from '~/constants';

import getParams from '~/utils/getUrlParams';

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
    path: '/signin',
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

  it.skip('handles URL parameters correctly', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });

    (getParams as Mock).mockReturnValueOnce({
      url: 'https://api.example.com/posts/123',
      body: '{"title": "Test Post"}',
      initialMethod: METHODS.POST,
      headers: [{ name: 'Authorization', value: 'Bearer token' }],
    });

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('https://api.example.com/posts/123')
      ).toBeInTheDocument();
    });
  });

  it.skip('submits form data correctly', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });

    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { success: true },
      time: Date.now(),
      duration: 100,
    };

    (sendServerRequest as Mock).mockResolvedValue(mockResponse);

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    await screen.findByRole('heading', { name: 'REST' });

    const input = screen.getByRole('input');
    fireEvent.input(input, { target: { value: 'https://npm.com' } });

    const sendButton = screen.getByRole('button', { name: /Send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendServerRequest).toHaveBeenCalledWith(
        METHODS.GET,
        'https://api.example.com/users',
        '{"test": "data"}',
        expect.any(Array)
      );
    });
  });

  it.skip('handles server request errors', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue({
      uid: 'user-123',
    });

    const errorResponse = {
      status: 0,
      statusText: 'Error',
      headers: {},
      data: undefined,
      time: Date.now(),
      duration: 0,
      error: 'Network error: Unable to connect to the server',
    };

    (sendServerRequest as Mock).mockResolvedValue(errorResponse);

    const Stub = createRoutesStub(testRoutes);
    renderWithProviders(<Stub initialEntries={[ROUTE]} />);

    await screen.findByRole('heading', { name: 'REST' });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendServerRequest).toHaveBeenCalled();
    });
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
    expect(response?.headers.get('Location')).toBe('/signin');
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
