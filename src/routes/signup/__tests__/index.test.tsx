import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from '..';
import { MemoryRouter } from 'react-router';

test('SignUp renders', async () => {
  const TITLE = 'Sign Up';

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
