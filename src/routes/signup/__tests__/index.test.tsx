import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from '..';
import { MemoryRouter } from 'react-router';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [null, false],
}));

test.skip('SignUp renders', async () => {
  const TITLE = 'Sign Up';

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
