import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import SignInPage, { loader as requireGuestLoader } from '../index';

import * as authServer from '~/utils/auth.server';
import * as firebase from '~/firebase';
import * as validationUtils from '~/utils/validation';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('~/firebase', () => ({
  logInWithEmailAndPassword: vi.fn(),
}));

vi.mock('~/utils/validation', () => ({
  validateEmail: vi.fn(),
}));

vi.mock('../../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

const HomePage = () => <h1>Home Page</h1>;

const testRoutes = [
  {
    path: '/signin',
    Component: SignInPage,
    loader: requireGuestLoader,
  },
  {
    path: '/',
    Component: HomePage,
  },
];

describe('/signin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  describe('loaders logic', () => {
    it('renders SignInPage for unauthorized user', async () => {
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signin']} />);

      expect(
        await screen.findByRole('heading', { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it('redirects to home page for authorized user', async () => {
      (authServer.getUserFromRequest as Mock).mockResolvedValue({
        uid: 'user-123',
      });

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signin']} />);

      expect(
        await screen.findByRole('heading', { name: /home page/i })
      ).toBeInTheDocument();
    });
  });

  describe('form logic', () => {
    it('successful login', async () => {
      const user = userEvent.setup();
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);
      (validationUtils.validateEmail as Mock).mockReturnValue(true);

      const mockUserCredential = {
        user: {
          getIdToken: vi.fn().mockResolvedValue('fake-jwt-token-123'),
        },
      };
      (firebase.logInWithEmailAndPassword as Mock).mockResolvedValue(
        mockUserCredential
      );

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signin']} />);

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const loginButton = await screen.findByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(loginButton);

      expect(firebase.logInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );

      await waitFor(() => {
        expect(document.cookie).toContain('session=fake-jwt-token-123');
      });

      expect(
        await screen.findByRole('heading', { name: /home page/i })
      ).toBeInTheDocument();
    });
  });
});
