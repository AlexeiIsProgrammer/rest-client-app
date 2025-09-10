import type { Variable } from '../routes/variables/types';

const VARIABLES_STORAGE_KEY = 'rest-client-variables';

export const saveVariablesToStorage = (variables: Variable[]): void => {
  try {
    localStorage.setItem(VARIABLES_STORAGE_KEY, JSON.stringify(variables));
  } catch (error) {
    console.error('Failed to save variables to localStorage:', error);
  }
};

export const loadVariablesFromStorage = (): Variable[] => {
  try {
    const stored = localStorage.getItem(VARIABLES_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.filter(
      (item): item is Variable =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.value === 'string'
    );
  } catch (error) {
    console.error('Failed to load variables from localStorage:', error);
    return [];
  }
};

export const clearVariablesFromStorage = (): void => {
  try {
    localStorage.removeItem(VARIABLES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear variables from localStorage:', error);
  }
};

export const substituteVariables = (
  text: string,
  variables: Variable[]
): string => {
  let result = text;
  
  const variableMap = new Map(
    variables.map(variable => [variable.name, variable.value])
  );
  
  result = result.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    const value = variableMap.get(trimmedName);
    return value !== undefined ? value : match;
  });
  
  return result;
};