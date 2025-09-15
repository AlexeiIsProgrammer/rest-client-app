import type { Variable } from '../routes/variables/types';
import { auth } from '~/firebase';

const VARIABLES_STORAGE_KEY = 'rest-client-variables';

const getCurrentUserId = (fallbackUserId?: string): string => {
  const user = auth.currentUser;
  const userId = user?.uid || user?.email || fallbackUserId || 'anonymous';
  return userId;
};

const loadAllUserVariables = (): Record<string, Variable[]> => {
  try {
    const stored = localStorage.getItem(VARIABLES_STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return { legacy: parsed };
    }

    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.error(
      'Failed to load all user variables from localStorage:',
      error
    );
    return {};
  }
};

const saveAllUserVariables = (
  allVariables: Record<string, Variable[]>
): void => {
  try {
    localStorage.setItem(VARIABLES_STORAGE_KEY, JSON.stringify(allVariables));
  } catch (error) {
    console.error('Failed to save all user variables to localStorage:', error);
  }
};

export const saveVariablesToStorage = (
  variables: Variable[],
  userId: string
): void => {
  const currentUserId = getCurrentUserId(userId);
  try {
    const allVariables = loadAllUserVariables();
    allVariables[currentUserId] = variables;
    saveAllUserVariables(allVariables);
  } catch (error) {
    console.error('Failed to save variables to localStorage:', error);
  }
};

export const loadVariablesFromStorage = (userId: string): Variable[] => {
  const currentUserId = getCurrentUserId(userId);
  try {
    const allVariables = loadAllUserVariables();
    const userVariables = allVariables[currentUserId] || [];

    const filteredVariables = userVariables.filter(
      (item): item is Variable =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.value === 'string'
    );

    return filteredVariables;
  } catch (error) {
    console.error('Failed to load variables from localStorage:', error);
    return [];
  }
};

export const clearVariablesFromStorage = (userId: string): void => {
  const currentUserId = getCurrentUserId(userId);
  try {
    const allVariables = loadAllUserVariables();
    const remainingVariables = Object.fromEntries(
      Object.entries(allVariables).filter(([key]) => key !== currentUserId)
    );
    saveAllUserVariables(remainingVariables);
  } catch (error) {
    console.error('Failed to clear variables from localStorage:', error);
  }
};

export const clearAllUserVariables = (): void => {
  try {
    localStorage.removeItem(VARIABLES_STORAGE_KEY);
  } catch (error) {
    console.error(
      'Failed to clear all user variables from localStorage:',
      error
    );
  }
};

export const substituteVariables = (
  text: string | unknown,
  variables: Variable[]
): string => {
  if (typeof text !== 'string') {
    return String(text || '');
  }

  let result = text;

  const variableMap = new Map(
    variables.map((variable) => [variable.name, variable.value])
  );

  result = result.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    const value = variableMap.get(trimmedName);
    return value !== undefined ? value : match;
  });

  return result;
};
