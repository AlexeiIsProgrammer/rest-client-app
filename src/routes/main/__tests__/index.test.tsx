import { expect, test, vi } from 'vitest';
import Main from '..';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{ email: 'test@example.com' }, false],
}));

test('Main renders', async () => {
  render(
    <MemoryRouter>
      <Main />
    </MemoryRouter>
  );

  expect(await screen.getByText(/welcome/i)).toBeInTheDocument();
});
