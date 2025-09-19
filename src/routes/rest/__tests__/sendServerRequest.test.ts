import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { sendServerRequest } from '../sendServerRequest';
import { METHODS } from '~/constants';
import type { Header } from '~/types';

global.fetch = vi.fn();

describe('sendServerRequest', () => {
  const mockHeaders: Header[] = [
    { name: 'Authorization', value: 'Bearer token123' },
    { name: 'X-Custom-Header', value: 'custom-value' },
  ];

  const mockJsonResponse = { id: 1, name: 'Test Item' };
  const mockTextResponse = 'Plain text response';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should successfully make a GET request without body', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'content-type': 'application/json',
        'x-custom': 'value',
      }),
      json: () => Promise.resolve(mockJsonResponse),
    });

    const startTime = Date.now();
    vi.setSystemTime(startTime);

    const result = await sendServerRequest(
      METHODS.GET,
      'https://api.example.com/items',
      '',
      mockHeaders
    );

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/items', {
      method: METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'custom-value',
      },
    });

    expect(result).toEqual({
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-custom': 'value',
      },
      data: mockJsonResponse,
      time: startTime,
      duration: expect.any(Number),
    });
  });

  it('should successfully make a POST request with JSON body', async () => {
    const requestBody = '{"name":"New Item"}';

    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      statusText: 'Created',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: () => Promise.resolve(mockJsonResponse),
    });

    const result = await sendServerRequest(
      METHODS.POST,
      'https://api.example.com/items',
      requestBody,
      mockHeaders
    );

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/items', {
      method: METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
        'X-Custom-Header': 'custom-value',
      },
      body: requestBody,
    });

    expect(result.status).toBe(201);
  });

  it('should handle non-JSON responses correctly', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'content-type': 'text/plain',
      }),
      text: () => Promise.resolve(mockTextResponse),
    });

    const result = await sendServerRequest(
      METHODS.GET,
      'https://api.example.com/text',
      '',
      mockHeaders
    );

    expect(result.data).toBe(mockTextResponse);
  });

  it('should handle HTTP error responses with appropriate error messages', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      json: () => Promise.resolve({ error: 'Resource not found' }),
    });

    const result = await sendServerRequest(
      METHODS.GET,
      'https://api.example.com/nonexistent',
      '',
      mockHeaders
    );

    expect(result.status).toBe(0);
    expect(result.error).toContain('HTTP 404');
    expect(result.error).toContain(
      'Not Found - The requested resource was not found'
    );
  });

  it('should handle network errors', async () => {
    (fetch as Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const result = await sendServerRequest(
      METHODS.GET,
      'https://api.example.com/items',
      '',
      mockHeaders
    );

    expect(result.status).toBe(0);
    expect(result.error).toContain(
      'Network error: Unable to connect to the server'
    );
  });

  it('should handle invalid URLs', async () => {
    const result = await sendServerRequest(
      METHODS.GET,
      'invalid-url',
      '',
      mockHeaders
    );

    expect(result.status).toBe(0);
    expect(result.error).toContain('Invalid URL: The URL format is incorrect');
  });
});
