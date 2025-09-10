import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../../../context/VariablesContext', () => {
  return {
    useVariablesContext: () => ({
      variables: [],            
      addVariable: vi.fn(),
      updateVariable: vi.fn(),
      deleteVariable: vi.fn(),
      loading: false,
    }),
  };
});

import Variables from '../index';

test('renders Variables heading', () => {
  render(<Variables />);
  expect(screen.getByRole('heading', { name: /variables/i })).toBeInTheDocument();
});
