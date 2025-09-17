import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

import SignUpPage, { loader as requireGuestLoader } from '../index';

import * as authServer from '~/utils/auth.server';
import * as firebase from '~/firebase';
import * as validationUtils from '~/utils/validation';
import { createRoutesStub } from 'react-router';

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('~/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
}));

vi.mock('~/utils/validation', () => ({
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
}));

vi.mock('../../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

const HomePage = () => <h1>Home Page</h1>;

const testRoutes = [
  {
    path: '/signup',
    Component: SignUpPage,
    loader: requireGuestLoader,
  },
  {
    path: '/',
    Component: HomePage,
  },
];

describe('/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  describe('loaders logic', () => {
    it('renders SignUpPage for unauthorized user', async () => {
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      expect(
        await screen.findByRole('heading', { name: /sign up/i })
      ).toBeInTheDocument();
    });

    it('redirects to home page for authorized user', async () => {
      (authServer.getUserFromRequest as Mock).mockResolvedValue({
        uid: 'user-123',
      });

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      expect(
        await screen.findByRole('heading', { name: /home page/i })
      ).toBeInTheDocument();
    });
  });

  describe('form logic', () => {
    it('shows error for invalid email', async () => {
      const user = userEvent.setup();
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);
      (validationUtils.validateEmail as Mock).mockReturnValue(false);

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const registerButton = await screen.findByRole('button', {
        name: /register/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      await user.click(registerButton);

      expect(
        await screen.findByText(/invalid email format/i)
      ).toBeInTheDocument();
      expect(firebase.registerWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it('shows error for invalid password', async () => {
      const user = userEvent.setup();
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);
      (validationUtils.validateEmail as Mock).mockReturnValue(true);
      (validationUtils.validatePassword as Mock).mockReturnValue(false);

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const registerButton = await screen.findByRole('button', {
        name: /register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'weak');
      await user.click(registerButton);

      expect(
        await screen.findByText(/Password must be at least 8 characters/i)
      ).toBeInTheDocument();
      expect(firebase.registerWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it('shows error for email already in use', async () => {
      const user = userEvent.setup();
      const apiError = new Error(
        'Firebase: Error (auth/email-already-in-use).'
      );
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);
      (validationUtils.validateEmail as Mock).mockReturnValue(true);
      (validationUtils.validatePassword as Mock).mockReturnValue(true);
      (firebase.registerWithEmailAndPassword as Mock).mockRejectedValue(
        apiError
      );

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const registerButton = await screen.findByRole('button', {
        name: /register/i,
      });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.click(registerButton);

      expect(await screen.findByText(apiError.message)).toBeInTheDocument();
    });

    it('registers new user', async () => {
      const user = userEvent.setup();
      (authServer.getUserFromRequest as Mock).mockResolvedValue(null);
      (validationUtils.validateEmail as Mock).mockReturnValue(true);
      (validationUtils.validatePassword as Mock).mockReturnValue(true);
      const mockUser = {
        getIdToken: vi.fn().mockResolvedValue('new-fake-jwt-token-456'),
      };
      (firebase.registerWithEmailAndPassword as Mock).mockResolvedValue(
        mockUser
      );

      const Stub = createRoutesStub(testRoutes);
      render(<Stub initialEntries={['/signup']} />);

      const emailInput = await screen.findByLabelText(/email/i);
      const passwordInput = await screen.findByLabelText(/password/i);
      const registerButton = await screen.findByRole('button', {
        name: /register/i,
      });

      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'Password123!');
      await user.click(registerButton);

      expect(firebase.registerWithEmailAndPassword).toHaveBeenCalledWith(
        'newuser@example.com',
        'Password123!'
      );

      await waitFor(() => {
        expect(document.cookie).toContain('session=new-fake-jwt-token-456');
      });

      expect(
        await screen.findByRole('heading', { name: /home page/i })
      ).toBeInTheDocument();
    });
  });
});
