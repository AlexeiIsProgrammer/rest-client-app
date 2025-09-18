import { renderHook, act, waitFor } from '@testing-library/react';
import { useVariables } from '../index';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useVariables', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

  it('should return updateVariable', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.updateVariable).toEqual(expect.any(Function));
  });

  it('should return deleteVariable', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.deleteVariable).toEqual(expect.any(Function));
  });

  it('should return clearAllVariables', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.clearAllVariables).toEqual(expect.any(Function));
  });

  it('should return getVariableByName', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.getVariableByName).toEqual(expect.any(Function));
  });

  it('should return loadVariables', () => {
    const { result } = renderHook(() => useVariables('test-user'));
    expect(result.current.loadVariables).toEqual(expect.any(Function));
  });

  it('should return variables after adding a new variable', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    act(() => {
      result.current.addVariable('test-variable', 'test-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toEqual([{ id: expect.any(String), name: 'test-variable', value: 'test-value' }]);
    });
  });

  it('should return variables after updating a variable', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    let addedVariable: { id: string; name: string; value: string };
    
    act(() => {
      addedVariable = result.current.addVariable('test-variable', 'test-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toHaveLength(1);
    });
    
    act(() => {
      result.current.updateVariable(addedVariable.id, 'updated-variable', 'updated-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toEqual([{ 
        id: addedVariable.id, 
        name: 'updated-variable', 
        value: 'updated-value' 
      }]);
    });
  });

  it('should return variables after deleting a variable', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    let addedVariable: { id: string; name: string; value: string };
    
    act(() => {
      addedVariable = result.current.addVariable('test-variable', 'test-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toHaveLength(1);
    });
    
    act(() => {
      result.current.deleteVariable(addedVariable.id);
    });
    
    await waitFor(() => {
      expect(result.current.variables).toEqual([]);
    });
  });

  it('should return variables after clearing all variables', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    act(() => {
      result.current.addVariable('test-variable', 'test-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toHaveLength(1);
    });
    
    act(() => {
      result.current.clearAllVariables();
    });
    
    await waitFor(() => {
      expect(result.current.variables).toEqual([]);
    });
  });

  it('should return variables after loading variables', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    act(() => {
      result.current.loadVariables();
    });
    
    await waitFor(() => {
      expect(result.current.variables).toEqual([]);
    });
  });

  it('should return variable by name', async () => {
    const { result } = renderHook(() => useVariables('test-user'));
    
    let addedVariable: { id: string; name: string; value: string } | undefined;
    
    act(() => {
      addedVariable = result.current.addVariable('test-variable', 'test-value');
    });
    
    await waitFor(() => {
      expect(result.current.variables).toHaveLength(1);
    });
    
    const foundVariable = result.current.getVariableByName('test-variable');
    
    expect(foundVariable).toEqual(addedVariable);
  });
});
