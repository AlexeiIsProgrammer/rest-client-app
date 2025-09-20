import { describe, it, expect } from 'vitest';
import transformServerTimestamp from '../transformServerTimestamp';

describe('transformServerTimestamp', () => {
  it('should convert Unix timestamp to ISO string', () => {
    const timestamp = 1640995200;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(1640995200 * 1000).toISOString();

    expect(result).toBe(expected);
    expect(result).toBe('2022-01-01T00:00:00.000Z');
  });

  it('should handle zero timestamp', () => {
    const timestamp = 0;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(0).toISOString();

    expect(result).toBe(expected);
    expect(result).toBe('1970-01-01T00:00:00.000Z');
  });

  it('should handle negative timestamp', () => {
    const timestamp = -3600;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(-3600 * 1000).toISOString();

    expect(result).toBe(expected);
    expect(result).toBe('1969-12-31T23:00:00.000Z');
  });

  it('should handle fractional timestamp', () => {
    const timestamp = 1640995200.5;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(1640995200.5 * 1000).toISOString();

    expect(result).toBe(expected);
  });

  it('should handle very large timestamp', () => {
    const timestamp = 253402300799;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(253402300799 * 1000).toISOString();

    expect(result).toBe(expected);
  });

  it('should handle very small timestamp', () => {
    const timestamp = -62135596800;
    const result = transformServerTimestamp(timestamp);
    const expected = new Date(-62135596800 * 1000).toISOString();

    expect(result).toBe(expected);
  });

  it('should return consistent results for the same input', () => {
    const timestamp = 1640995200;
    const result1 = transformServerTimestamp(timestamp);
    const result2 = transformServerTimestamp(timestamp);

    expect(result1).toBe(result2);
  });

  it('should handle current timestamp', () => {
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const result = transformServerTimestamp(currentUnixTimestamp);
    const expected = new Date(currentUnixTimestamp * 1000).toISOString();

    expect(result).toBe(expected);
  });
});
