import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from '..';

test('SignUp renders', async () => {
  const TITLE = 'Sign Up';

  render(<SignUp />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
