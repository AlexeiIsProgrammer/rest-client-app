import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import MainPage, { loader as mainLoader } from '../index';

import * as authServer from '~/utils/auth.server';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

const testRoutes = [
  {
    path: '/',
    Component: MainPage,
    loader: mainLoader,
  },
];

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MainPage for unauthorized user', async () => {
    (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(
      await screen.findByRole('heading', { name: /welcome!/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: /rest client/i })
    ).not.toBeInTheDocument();
  });

  it.skip('should render MainPage for authorized user', async () => {
    const mockUser = { uid: 'user-123', email: 'test@example.com' };
    (authServer.getUserFromRequest as Mock).mockResolvedValue(mockUser);

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(
      await screen.findByRole('heading', {
        name: /welcome, test@example.com!/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /rest client/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();

    expect(
      screen.queryByRole('link', { name: /sign in/i })
    ).not.toBeInTheDocument();
  });
});
