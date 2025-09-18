import { renderHook } from '@testing-library/react';
import { useVariables } from '../index';
import { describe, it, expect } from 'vitest';

describe('useVariables', () => {
  it('should return variables', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.variables).toEqual([]);
  });

  it('should return loading as false after initialization', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.loading).toEqual(false);
  });

  it('should return addVariable', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.addVariable).toEqual(expect.any(Function));
  });
});
