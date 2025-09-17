import { expect, vi, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneratedCode from '..';
import { LANGUAGE_OPTIONS, LANGUAGES, METHODS } from '~/constants';
import type { GeneratedCodeProps } from '../types';
import { generateCode } from '~/utils/codeGenerators';

vi.mock('~/utils/codeGenerators', () => ({
  generateCode: vi.fn(),
}));

const mockProps: GeneratedCodeProps = {
  method: METHODS.GET,
  url: 'https://api.example.com/users',
  body: '{"name": "John"}',
  headers: [{ name: 'Content-Type', value: 'application/json' }],
};

describe('GeneratedCode', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default language selected', async () => {
    render(<GeneratedCode {...mockProps} />);

    expect(screen.getByDisplayValue(LANGUAGES.curl)).toBeInTheDocument();
  });

  it.skip('displays all language options in the dropdown', () => {
    render(<GeneratedCode {...mockProps} />);

    const select = screen.getByTestId('select');
    fireEvent.mouseDown(select);

    LANGUAGE_OPTIONS.forEach((option) => {
      expect(screen.getByRole('li', { name: option })).toBeInTheDocument();
    });
  });

  it.skip('updates code when language is changed', async () => {
    render(<GeneratedCode {...mockProps} />);

    const select = screen.getByTestId('select');
    fireEvent.mouseDown(select);

    const javascriptOption = screen.getByRole('li', {
      name: LANGUAGES['javascript-fetch'],
    });
    fireEvent.click(javascriptOption);

    expect(generateCode).toHaveBeenCalledWith(
      mockProps.method,
      mockProps.url,
      mockProps.body,
      mockProps.headers,
      LANGUAGES['javascript-fetch']
    );
  });

  it('shows fallback content when no code is generated', async () => {
    render(<GeneratedCode {...mockProps} />);

    expect(screen.getByText(/Select a language/i)).toBeInTheDocument();
  });

  it('updates code when props change', async () => {
    const { rerender } = render(<GeneratedCode {...mockProps} />);

    const newProps = {
      ...mockProps,
      method: METHODS.POST,
      url: 'https://api.example.com/users/create',
    };

    rerender(<GeneratedCode {...newProps} />);

    expect(generateCode).toHaveBeenCalledWith(
      newProps.method,
      newProps.url,
      newProps.body,
      newProps.headers,
      LANGUAGES.curl
    );
  });
});
