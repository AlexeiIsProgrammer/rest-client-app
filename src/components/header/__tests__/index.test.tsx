import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoutesStub } from 'react-router';

vi.mock('@mui/material/useScrollTrigger', () => ({
  default: vi.fn(() => false),
}));

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => ({
    home: { value: 'Home' },
    logo: { value: 'Logo' },
    logout: 'Main',
    'sign-in': 'Sign In',
    'sign-up': 'Sign Up',
  })),
}));

vi.mock('~/hooks/useLocalizedNavigate', () => ({
  useLocalizedNavigate: () => vi.fn(),
}));

vi.mock('~/components/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

vi.mock('~/components/LocalizedLink', () => ({
  default: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteLoaderData: vi.fn(),
  };
});

vi.mock('~/utils/auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('~/utils/validation', () => ({
  validateEmail: vi.fn(),
}));

const testRoutes = [
  {
    path: '/',
    Component: Header,
  },
];

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header with all basic elements for unauthenticated user', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({ user: null });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Main')).not.toBeInTheDocument();
  });

  it('should render main button for authenticated user', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({
      user: { email: 'test@example.com', uid: 'user-123' },
    });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('should render sign-in/sign-up buttons when user has no email', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({
      user: { uid: 'user-123' },
    });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Main')).not.toBeInTheDocument();
  });

  it('should render when scrolled', async () => {
    const useScrollTrigger = (await import('@mui/material/useScrollTrigger'))
      .default;
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useScrollTrigger).mockReturnValue(true);
    vi.mocked(useRouteLoaderData).mockReturnValue({ user: null });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should call main when main button is clicked', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({
      user: { email: 'test@example.com', uid: 'user-123' },
    });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    const logoutButton = screen.getByText('Main');
    fireEvent.click(logoutButton);
  });

  it('should have correct navigation links', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({ user: null });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    const signInLink = screen.getByText('Sign In').closest('a');
    const signUpLink = screen.getByText('Sign Up').closest('a');
    const homeLink = screen.getByAltText('Logo').closest('a');

    expect(signInLink).toHaveAttribute('href', '/signin');
    expect(signUpLink).toHaveAttribute('href', '/signup');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have proper ARIA labels and accessibility', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({ user: null });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should handle undefined user data', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue(undefined);

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('should handle null user data', async () => {
    const { useRouteLoaderData } = await import('react-router');
    vi.mocked(useRouteLoaderData).mockReturnValue({ user: null });

    const Stub = createRoutesStub(testRoutes);
    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
