import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MethodSelector from '..';
import { METHODS, METHODS_OPTIONS } from '~/constants';

describe('MethodSelector', () => {
  const mockSetMethod = vi.fn();
  const initialMethod = METHODS.GET;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial method selected', () => {
    render(<MethodSelector method={initialMethod} setMethod={mockSetMethod} />);

    expect(screen.getByLabelText('Method')).toBeInTheDocument();
    expect(screen.getByDisplayValue(METHODS.GET)).toBeInTheDocument();
  });

  it('displays all HTTP method options', () => {
    render(<MethodSelector method={initialMethod} setMethod={mockSetMethod} />);

    const select = screen.getByLabelText('Method');
    fireEvent.mouseDown(select);

    METHODS_OPTIONS.forEach((method) => {
      expect(screen.getByRole('option', { name: method })).toBeInTheDocument();
    });
  });

  it('calls setMethod when a different method is selected', () => {
    render(<MethodSelector method={initialMethod} setMethod={mockSetMethod} />);

    const select = screen.getByLabelText('Method');
    fireEvent.mouseDown(select);

    const postOption = screen.getByRole('option', { name: METHODS.POST });
    fireEvent.click(postOption);

    expect(mockSetMethod).toHaveBeenCalledWith(METHODS.POST);
  });

  it('maintains the selected method when re-rendered', () => {
    const { rerender } = render(
      <MethodSelector method={initialMethod} setMethod={mockSetMethod} />
    );

    expect(screen.getByDisplayValue(METHODS.GET)).toBeInTheDocument();

    rerender(
      <MethodSelector method={METHODS.POST} setMethod={mockSetMethod} />
    );

    expect(screen.getByDisplayValue(METHODS.POST)).toBeInTheDocument();
  });
});
