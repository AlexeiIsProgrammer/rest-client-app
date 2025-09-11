import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// import SignIn from '..';
import { MemoryRouter } from 'react-router';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false],
}));

test.skip('SignIn renders', async () => {
  const TITLE = 'Sign In';

  render(<MemoryRouter>{/* <SignIn /> */}</MemoryRouter>);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
