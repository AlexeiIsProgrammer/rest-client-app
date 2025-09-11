import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Variables from '..';

test('Variables renders', async () => {
  const TITLE = 'Variables';

  render(<Variables />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
