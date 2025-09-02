import { expect, test } from 'vitest';
import Home from '../home';
import { render, screen } from '@testing-library/react';

test('Home renders', async () => {
  const TITLE = 'Hello';

  render(<Home />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
