import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadersEditor from '..';
import type { Header } from '~/types';

describe('HeadersEditor', () => {
  const mockSetHeaders = vi.fn();
  const initialHeaders: Header[] = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Authorization', value: 'Bearer token' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial headers', () => {
    render(
      <HeadersEditor headers={initialHeaders} setHeaders={mockSetHeaders} />
    );

    expect(screen.getByText('Request Headers')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bearer token')).toBeInTheDocument();
    expect(screen.getByText('Add Header')).toBeInTheDocument();
  });

  it('calls setHeaders when adding a new header', () => {
    render(
      <HeadersEditor headers={initialHeaders} setHeaders={mockSetHeaders} />
    );

    const addButton = screen.getByText('Add Header');
    fireEvent.click(addButton);

    expect(mockSetHeaders).toHaveBeenCalledWith([
      ...initialHeaders,
      { name: '', value: '' },
    ]);
  });

  it('calls setHeaders when updating a header name', () => {
    render(
      <HeadersEditor headers={initialHeaders} setHeaders={mockSetHeaders} />
    );

    const nameInputs = screen.getAllByPlaceholderText('Header name');
    fireEvent.change(nameInputs[0], { target: { value: 'X-Custom-Header' } });

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { name: 'X-Custom-Header', value: 'application/json' },
      { name: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('calls setHeaders when updating a header value', () => {
    render(
      <HeadersEditor headers={initialHeaders} setHeaders={mockSetHeaders} />
    );

    const valueInputs = screen.getAllByPlaceholderText('Header value');
    fireEvent.change(valueInputs[1], { target: { value: 'Bearer new-token' } });

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Authorization', value: 'Bearer new-token' },
    ]);
  });

  it('calls setHeaders when removing a header', () => {
    render(
      <HeadersEditor headers={initialHeaders} setHeaders={mockSetHeaders} />
    );

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockSetHeaders).toHaveBeenCalledWith([
      { name: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('renders empty state correctly', () => {
    render(<HeadersEditor headers={[]} setHeaders={mockSetHeaders} />);

    expect(screen.getByText('Request Headers')).toBeInTheDocument();
    expect(screen.getByText('Add Header')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument();
  });

  it('adds a header when the add button is clicked with empty headers', () => {
    render(<HeadersEditor headers={[]} setHeaders={mockSetHeaders} />);

    const addButton = screen.getByText('Add Header');
    fireEvent.click(addButton);

    expect(mockSetHeaders).toHaveBeenCalledWith([{ name: '', value: '' }]);
  });
});
