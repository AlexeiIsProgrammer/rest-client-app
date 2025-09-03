import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rest from '..';

test('Rest renders', async () => {
  const TITLE = 'Rest';

  render(<Rest />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
