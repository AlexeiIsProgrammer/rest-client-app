import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';

vi.mock('@mui/material/useScrollTrigger', () => ({ default: () => false }));
vi.mock('react-firebase-hooks/auth', () => ({ useAuthState: vi.fn() }));

import { useAuthState } from 'react-firebase-hooks/auth';
import { createRoutesStub } from 'react-router';

const renderWithRouter = () => {
  const Stub = createRoutesStub([{ path: '', Component: Header }]);
  return render(<Stub initialEntries={['/']} />);
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header logo link and image', () => {
    (useAuthState as MockedFunction<typeof useAuthState>).mockReturnValue([
      null,
      false,
      undefined,
    ]);

    renderWithRouter();

    expect(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up when user is not authenticated', () => {
    (useAuthState as MockedFunction<typeof useAuthState>).mockReturnValue([
      null,
      false,
      undefined,
    ]);

    renderWithRouter();

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /logout/i })
    ).not.toBeInTheDocument();
  });
});
