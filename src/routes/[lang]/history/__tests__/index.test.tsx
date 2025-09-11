import { expect, test } from 'vitest';
import { /*render,*/ screen } from '@testing-library/react';
// import History from '..';

test.skip('History renders', async () => {
  const TITLE = 'History';

  // render(<History />);

  expect(screen.getByText(TITLE)).toBeInTheDocument();
});
