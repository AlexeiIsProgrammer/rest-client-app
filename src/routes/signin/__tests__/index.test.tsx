import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from '..';

test('SignIn renders', async () => {
  const TITLE = 'Sign In';

  render(<SignIn />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
