import { describe, it, expect, vi } from 'vitest';
import fromBase64 from '../fromBase64';

const originalAtob = global.atob;
const mockAtob = vi.fn();

describe('fromBase64', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.atob = mockAtob;
  });

  afterEach(() => {
    // Restore original atob
    global.atob = originalAtob;
  });

  it('should decode standard base64 string', () => {
    const base64String = 'SGVsbG8gV29ybGQ=';
    const expectedResult = 'Hello World';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('SGVsbG8gV29ybGQ=');
    expect(result).toBe(expectedResult);
  });

  it('should replace hyphens with plus signs', () => {
    const base64String = 'SGVsbG8-V29ybGQ=';
    const expectedResult = 'Hello World';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('SGVsbG8+V29ybGQ=');
    expect(result).toBe(expectedResult);
  });

  it('should replace underscores with slashes', () => {
    const base64String = 'SGVsbG8_V29ybGQ=';
    const expectedResult = 'Hello World';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('SGVsbG8/V29ybGQ=');
    expect(result).toBe(expectedResult);
  });

  it('should handle both hyphens and underscores', () => {
    const base64String = 'SGVsbG8-V29ybGQ_';
    const expectedResult = 'Hello World';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('SGVsbG8+V29ybGQ/');
    expect(result).toBe(expectedResult);
  });

  it('should handle empty string', () => {
    const base64String = '';
    const expectedResult = '';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('');
    expect(result).toBe(expectedResult);
  });

  it('should handle string without padding', () => {
    const base64String = 'SGVsbG8gV29ybGQ';
    const expectedResult = 'Hello World';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('SGVsbG8gV29ybGQ');
    expect(result).toBe(expectedResult);
  });

  it('should handle URL-safe base64 with multiple replacements', () => {
    const base64String = 'abc-def_ghi-jkl_mno';
    const expectedResult = 'decoded result';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('abc+def/ghi+jkl/mno');
    expect(result).toBe(expectedResult);
  });

  it('should handle special characters in base64', () => {
    const base64String = 'AQIDBAUGBwgJCgsMDQ4PEA==';
    const expectedResult = 'decoded binary data';

    mockAtob.mockReturnValue(expectedResult);

    const result = fromBase64(base64String);

    expect(mockAtob).toHaveBeenCalledWith('AQIDBAUGBwgJCgsMDQ4PEA==');
    expect(result).toBe(expectedResult);
  });

  it('should propagate errors from atob', () => {
    const base64String = 'invalid-base64!!';
    const error = new Error('Invalid character');

    mockAtob.mockImplementation(() => {
      throw error;
    });

    expect(() => {
      fromBase64(base64String);
    }).toThrow(error);

    expect(mockAtob).toHaveBeenCalledWith('invalid+base64!!');
  });

  it('should handle atob throwing DOMException for invalid input', () => {
    const base64String = '!!!invalid!!!';
    const domException = new DOMException(
      'The string contains invalid characters.'
    );

    mockAtob.mockImplementation(() => {
      throw domException;
    });

    expect(() => {
      fromBase64(base64String);
    }).toThrow(domException);
  });
});
