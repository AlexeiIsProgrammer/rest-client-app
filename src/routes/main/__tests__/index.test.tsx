import { expect, test } from 'vitest';
import Main from '..';
import { render, screen } from '@testing-library/react';

test('Main renders', async () => {
  const TITLE = 'Main';

  render(<Main />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
