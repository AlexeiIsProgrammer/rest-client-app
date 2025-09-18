import { describe, it, expect, vi, beforeEach } from 'vitest';
import toBase64 from '../toBase64';

const originalBtoa = global.btoa;
const mockBtoa = vi.fn();

describe('toBase64', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.btoa = mockBtoa;
  });

  afterEach(() => {
    global.btoa = originalBtoa;
  });

  it('should encode string to base64 and make it URL-safe', () => {
    const inputString = 'Hello World';
    const standardBase64 = 'SGVsbG8gV29ybGQ=';
    const urlSafeBase64 = 'SGVsbG8gV29ybGQ=';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(mockBtoa).toHaveBeenCalledWith(inputString);
    expect(result).toBe(urlSafeBase64);
  });

  it('should replace plus signs with hyphens', () => {
    const inputString = 'test+string';
    const standardBase64 = 'dGVzdCtzdHJpbmc=';
    const urlSafeBase64 = 'dGVzdCtzdHJpbmc=';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);

    expect(result).not.toContain('+');
  });

  it('should replace slashes with underscores', () => {
    const inputString = 'test/string';
    const standardBase64 = 'dGVzdC9zdHJpbmc=';
    const urlSafeBase64 = 'dGVzdC9zdHJpbmc=';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);
    expect(result).not.toContain('/');
  });

  it('should handle both plus signs and slashes', () => {
    const inputString = 'test+string/with+both';
    const standardBase64 = 'dGVzdCtzdHJpbmcvd2l0aCtib3Ro';
    const urlSafeBase64 = 'dGVzdCtzdHJpbmcvd2l0aCtib3Ro';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);
  });

  it('should handle empty string', () => {
    const inputString = '';
    const standardBase64 = '';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(mockBtoa).toHaveBeenCalledWith('');
    expect(result).toBe('');
  });

  it('should handle special characters', () => {
    const inputString = 'áéíóú';
    const standardBase64 = 'w6HDqcOtw7PDug==';
    const urlSafeBase64 = 'w6HDqcOtw7PDug==';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(mockBtoa).toHaveBeenCalledWith(inputString);
    expect(result).toBe(urlSafeBase64);
  });

  it('should handle binary data', () => {
    const inputString = String.fromCharCode(255, 255, 255, 254, 253);
    const standardBase64 = '/////v0=';
    const urlSafeBase64 = '_____v0=';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);
    expect(result).toContain('_');
  });

  it('should handle strings that produce plus signs in base64', () => {
    const inputString = '>>>';
    const standardBase64 = 'Pj4+';
    const urlSafeBase64 = 'Pj4-';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);
  });

  it('should handle strings that produce slashes in base64', () => {
    const inputString = String.fromCharCode(63, 64, 65);
    const standardBase64 = 'P0BB';
    const urlSafeBase64 = 'P0BB';

    mockBtoa.mockReturnValue(standardBase64);

    const result = toBase64(inputString);

    expect(result).toBe(urlSafeBase64);
  });

  it('should propagate errors from btoa', () => {
    const inputString = 'invalid-string';
    const error = new Error('Invalid character');

    mockBtoa.mockImplementation(() => {
      throw error;
    });

    expect(() => {
      toBase64(inputString);
    }).toThrow(error);

    expect(mockBtoa).toHaveBeenCalledWith(inputString);
  });
});
