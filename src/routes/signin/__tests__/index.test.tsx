import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from '..';
import { MemoryRouter } from 'react-router';

test('SignIn renders', async () => {
  const TITLE = 'Sign In';

  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
