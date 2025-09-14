import { useState, useEffect, useCallback } from 'react';
import type { Variable } from '../../routes/variables/types';
import {
  saveVariablesToStorage,
  loadVariablesFromStorage,
  clearVariablesFromStorage,
} from '~/utils/variableStorage';

export const useVariables = (userId: string) => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const loadedVariables = loadVariablesFromStorage(userId);
      setVariables(loadedVariables);
      setLoading(false);
    } else {
      setVariables([]);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!loading && userId) {
      saveVariablesToStorage(variables, userId);
    }
  }, [variables, loading, userId]);

  const addVariable = useCallback((name: string, value: string) => {
    const newVariable: Variable = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      value: value.trim(),
    };

    setVariables((prev) => {
      const updated = [...prev, newVariable];
      return updated;
    });
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
    [setVariables]
  );

  const deleteVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((variable) => variable.id !== id));
  }, []);

  const clearAllVariables = useCallback(() => {
    setVariables([]);
    if (userId) {
      clearVariablesFromStorage(userId);
    }
  }, [userId]);

  const getVariableByName = useCallback(
    (name: string) => {
      return variables.find((variable) => variable.name === name);
    },
    [variables]
  );

  const loadVariables = useCallback(() => {
    if (userId) {
      const loadedVariables = loadVariablesFromStorage(userId);
      setVariables(loadedVariables);
    }
  }, [userId]);

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
