import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from '../Header';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@mui/material/useScrollTrigger', () => ({ default: () => false }));
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false, null]
}));

const theme = createTheme();

const renderWithRouter = (ui: React.ReactElement) =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  );

describe('Header', () => {
  it('renders the header logo link', () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  it('renders the login button', () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByRole('link', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('renders the sign up button', () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByRole('link', { name: /sign up/i })
    ).toBeInTheDocument();
  });
});
