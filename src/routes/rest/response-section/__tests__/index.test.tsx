import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResponseSection from '..';
import type { RESTResponse } from '~/types';

describe('ResponseSection', () => {
  const mockSuccessResponse: RESTResponse = {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
      'x-custom-header': 'value',
    },
    data: '{"name": "John", "age": 30}',
    time: Date.now(),
    duration: 150,
  };

  const mockErrorResponse: RESTResponse = {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'content-type': 'application/json',
    },
    error: 'Resource not found',
    time: Date.now(),
    duration: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when response is null', () => {
    const { container } = render(<ResponseSection response={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders success response correctly', () => {
    render(<ResponseSection response={mockSuccessResponse} />);

    expect(screen.getByText(/Response/)).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('CancelIcon')).not.toBeInTheDocument();
  });

  it('renders error response correctly', () => {
    render(<ResponseSection response={mockErrorResponse} />);

    expect(
      screen.getByText('Response - 404 Not Found (100 ms)')
    ).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('CheckCircleIcon')).not.toBeInTheDocument();
    expect(screen.getByText(/Resource not found/)).toBeInTheDocument();
  });

  it('displays all tabs', () => {
    render(<ResponseSection response={mockSuccessResponse} />);

    expect(screen.getByRole('tab', { name: 'Body' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Headers' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Raw' })).toBeInTheDocument();
  });

  it('shows body tab content by default', () => {
    render(<ResponseSection response={mockSuccessResponse} />);

    expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/age/i)).toBeInTheDocument();
    expect(screen.getByText(/30/i)).toBeInTheDocument();
  });

  it('shows no response body message when data is empty', () => {
    const responseWithoutData = { ...mockSuccessResponse, data: undefined };
    render(<ResponseSection response={responseWithoutData} />);

    expect(screen.getByText('No response body')).toBeInTheDocument();
  });

  it('switches to headers tab and shows headers', () => {
    render(<ResponseSection response={mockSuccessResponse} />);

    const headersTab = screen.getByRole('tab', { name: 'Headers' });
    fireEvent.click(headersTab);

    expect(screen.getByText('Headers (2)')).toBeInTheDocument();
    expect(screen.getByText(/content-type/i)).toBeInTheDocument();
    expect(screen.getByText(/application/i)).toBeInTheDocument();
    expect(screen.getByText(/x-custom-header/i)).toBeInTheDocument();
  });

  it('toggles headers expansion', () => {
    render(<ResponseSection response={mockSuccessResponse} />);

    const headersTab = screen.getByRole('tab', { name: 'Headers' });
    fireEvent.click(headersTab);

    const expandButton = screen.getByTestId('ExpandMoreIcon');
    fireEvent.click(expandButton);

    expect(screen.getByText('content-type')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
  });

  it('handles response without duration', () => {
    const responseWithoutDuration = {
      ...mockSuccessResponse,
      duration: undefined,
    };
    render(<ResponseSection response={responseWithoutDuration} />);

    expect(screen.getByText('Response - 200 OK')).toBeInTheDocument();
    expect(screen.queryByText('ms')).not.toBeInTheDocument();
  });

  it('handles response without status', () => {
    const responseWithoutStatus = { ...mockSuccessResponse, status: undefined };
    render(<ResponseSection response={responseWithoutStatus} />);

    expect(screen.getByText(/Response/)).toBeInTheDocument();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });
});
