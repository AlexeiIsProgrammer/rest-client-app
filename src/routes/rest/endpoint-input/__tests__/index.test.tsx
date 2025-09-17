import { expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { VariablesProvider } from '~/context/VariablesContext';
import EndpointInput from '..';

const mockSetUrl = vi.fn();

const renderWithProviders = (url: string = '') =>
  render(
    <VariablesProvider>
      <EndpointInput url={url} setUrl={mockSetUrl} />
    </VariablesProvider>
  );

describe('Endpoint input', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders with placeholder and label', () => {
    renderWithProviders();

    expect(screen.getByLabelText(/Endpoint URL/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('https://api.example.com/endpoint')
    ).toBeInTheDocument();
  });

  it('calls setUrl on input change', () => {
    renderWithProviders();

    const NEW_URL = 'https://new-url.com';

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: NEW_URL } });

    expect(mockSetUrl).toHaveBeenCalledWith(NEW_URL);
  });

  it('does not show chip when no variables are present', () => {
    renderWithProviders('https://api.example.com/users');

    expect(screen.queryByText(/variable/)).not.toBeInTheDocument();
  });

  it('shows singular chip text for single variable', () => {
    renderWithProviders('https://api.example.com/{{id}}');

    expect(screen.getByText('1 variable')).toBeInTheDocument();
  });

  it('shows plural chip text for multiple variables', () => {
    renderWithProviders('https://api.example.com/{{id}}/{{name}}/{{type}}');

    expect(screen.getByText('3 variables')).toBeInTheDocument();
  });
});
