import { useState, useEffect, useCallback } from 'react';
import type { Variable } from '../../routes/variables/types';
import {
  saveVariablesToStorage,
  loadVariablesFromStorage,
  clearVariablesFromStorage,
} from '~/utils/variableStorage';

export const useVariables = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedVariables = loadVariablesFromStorage();
    setVariables(loadedVariables);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveVariablesToStorage(variables);
    }
  }, [variables, loading]);

  const addVariable = useCallback((name: string, value: string) => {
    const newVariable: Variable = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      value: value.trim(),
    };

    setVariables((prev) => [...prev, newVariable]);
    return newVariable;
  }, []);

  const updateVariable = useCallback(
    (id: string, name: string, value: string) => {
      setVariables((prev) =>
        prev.map((variable) =>
          variable.id === id
            ? { ...variable, name: name.trim(), value: value.trim() }
            : variable
        )
      );
    },
    []
  );

  const deleteVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((variable) => variable.id !== id));
  }, []);

  const clearAllVariables = useCallback(() => {
    setVariables([]);
    clearVariablesFromStorage();
  }, []);

  const getVariableByName = useCallback(
    (name: string) => {
      return variables.find((variable) => variable.name === name);
    },
    [variables]
  );

  const loadVariables = useCallback(() => {
    const loadedVariables = loadVariablesFromStorage();
    setVariables(loadedVariables);
  }, []);

  return {
    variables,
    loading,
    addVariable,
    updateVariable,
    deleteVariable,
    clearAllVariables,
    getVariableByName,
    loadVariables,
  };
};
