import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Auth from '..';

test('Auth renders', async () => {
  const TITLE = 'Auth';

  render(<Auth />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
