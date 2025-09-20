import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';
import getParams from '../getUrlParams';
import { METHODS } from '~/constants';
import fromBase64 from '../fromBase64';

vi.mock('../fromBase64', () => ({
  default: vi.fn(),
}));

describe('getParams', () => {
  const mockFromBase64 = fromBase64 as MockedFunction<typeof fromBase64>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default values when no parameters provided', () => {
    const searchParams = new URLSearchParams();

    const result = getParams({ searchParams });

    expect(result).toEqual({
      initialMethod: METHODS.GET,
      url: '',
      body: '',
      headers: [],
      variables: [],
    });
  });

  it('should use provided method parameter', () => {
    const searchParams = new URLSearchParams();

    const result = getParams({
      method: 'post',
      searchParams,
    });

    expect(result.initialMethod).toBe(METHODS.POST);
  });

  it('should decode URL from base64 when encodedUrl provided', () => {
    const searchParams = new URLSearchParams();
    mockFromBase64.mockReturnValue('https://api.example.com/users');

    const result = getParams({
      encodedUrl: 'encoded-url-base64',
      searchParams,
    });

    expect(mockFromBase64).toHaveBeenCalledWith('encoded-url-base64');
    expect(result.url).toBe('https://api.example.com/users');
  });

  it('should parse JSON body when encodedBody is valid JSON', () => {
    const searchParams = new URLSearchParams();
    mockFromBase64.mockReturnValue('{"name": "John", "age": 30}');

    const result = getParams({
      encodedBody: 'encoded-body-base64',
      searchParams,
    });

    expect(mockFromBase64).toHaveBeenCalledWith('encoded-body-base64');
    expect(result.body).toEqual({ name: 'John', age: 30 });
  });

  it('should use raw body when encodedBody is not valid JSON', () => {
    const searchParams = new URLSearchParams();
    mockFromBase64.mockReturnValue('plain text body');

    const result = getParams({
      encodedBody: 'encoded-body-base64',
      searchParams,
    });

    expect(mockFromBase64).toHaveBeenCalledWith('encoded-body-base64');
    expect(result.body).toBe('plain text body');
  });

  it('should parse headers from search parameters', () => {
    const searchParams = new URLSearchParams();
    searchParams.append('Content-Type', 'application%2Fjson');
    searchParams.append('Authorization', 'Bearer%20token123');

    const result = getParams({ searchParams });

    expect(result.headers).toEqual([
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Authorization', value: 'Bearer token123' },
    ]);
  });

  it('should parse variables from base64 when encodedVariables provided', () => {
    const searchParams = new URLSearchParams();

    mockFromBase64.mockReturnValue('[{"name": "id", "value": "123"}]');

    const result = getParams({
      encodedVariables: 'encoded-vars-base64',
      searchParams,
    });

    expect(mockFromBase64).toHaveBeenCalledWith('encoded-vars-base64');
    expect(result.variables).toEqual([{ name: 'id', value: '123' }]);
  });

  it('should return empty array for variables when encodedVariables is not valid JSON', () => {
    const searchParams = new URLSearchParams();
    mockFromBase64.mockReturnValue('invalid json');

    const result = getParams({
      encodedVariables: 'encoded-vars-base64',
      searchParams,
    });

    expect(mockFromBase64).toHaveBeenCalledWith('encoded-vars-base64');
    expect(result.variables).toEqual([]);
  });

  it('should handle multiple parameter combinations', () => {
    const searchParams = new URLSearchParams();
    searchParams.append('X-Custom-Header', 'custom%20value');

    // Set up mock return values in the exact order they will be called
    mockFromBase64
      .mockReturnValueOnce('https://api.example.com/posts') // First call: encodedUrl
      .mockReturnValueOnce('{"title": "Test Post"}') // Second call: encodedBody
      .mockReturnValueOnce('[{"name": "userId", "value": "456"}]'); // Third call: encodedVariables

    const result = getParams({
      method: 'PUT',
      encodedUrl: 'encoded-url',
      encodedBody: 'encoded-body',
      encodedVariables: 'encoded-vars',
      searchParams,
    });

    expect(result.initialMethod).toBe(METHODS.PUT);
    expect(result.url).toBe('https://api.example.com/posts');
    expect(result.body).toEqual({ title: 'Test Post' });
    expect(result.headers).toEqual([
      { name: 'X-Custom-Header', value: 'custom value' },
    ]);
    expect(result.variables).toEqual([{ name: 'userId', value: '456' }]);
  });

  it('should handle empty encoded parameters', () => {
    const searchParams = new URLSearchParams();

    mockFromBase64.mockReturnValue('');

    const result = getParams({
      encodedUrl: '',
      encodedBody: '',
      encodedVariables: '',
      searchParams,
    });

    expect(result.url).toBe('');
    expect(result.body).toBe('');
    expect(result.variables).toEqual([]);
  });

  it('should handle URL encoding in header values', () => {
    const searchParams = new URLSearchParams();
    searchParams.append(
      'Custom-Header',
      'value%20with%20spaces%20and%20%26%20symbols'
    );

    const result = getParams({ searchParams });

    expect(result.headers).toEqual([
      { name: 'Custom-Header', value: 'value with spaces and & symbols' },
    ]);
  });

  it('should handle complex JSON body with nested objects', () => {
    const searchParams = new URLSearchParams();
    const complexJson = JSON.stringify({
      user: {
        name: 'John',
        profile: { age: 30, active: true },
      },
      items: ['a', 'b', 'c'],
    });

    mockFromBase64.mockReturnValue(complexJson);

    const result = getParams({
      encodedBody: 'encoded-complex-body',
      searchParams,
    });

    expect(result.body).toEqual({
      user: {
        name: 'John',
        profile: { age: 30, active: true },
      },
      items: ['a', 'b', 'c'],
    });
  });
});
