import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { VariablesProvider } from '../VariablesContext';
import { renderHook, waitFor } from '@testing-library/react';
import { useVariablesContext } from '../VariablesContext';

describe('VariablesContext', () => {
  it('should throw an error if used outside of a VariablesProvider', () => {
    expect(() => {
      renderHook(() => useVariablesContext());
    }).toThrow('useVariablesContext must be used within a VariablesProvider');
  });

  it('should return the correct context value when used within VariablesProvider', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <VariablesProvider>{children}</VariablesProvider>
    );

    const { result } = renderHook(() => useVariablesContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current).toEqual({
      variables: [],
      loading: false,
      addVariable: expect.any(Function),
      updateVariable: expect.any(Function),
      deleteVariable: expect.any(Function),
      clearAllVariables: expect.any(Function),
      getVariableByName: expect.any(Function),
      loadVariables: expect.any(Function),
    });
  });
});
