import React, { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '~/firebase';
import { useVariables } from '~/hooks/useVariables';
import type { Variable } from '../routes/variables/types';

interface VariablesContextType {
  variables: Variable[];
  loading: boolean;
  addVariable: (name: string, value: string) => Variable;
  updateVariable: (id: string, name: string, value: string) => void;
  deleteVariable: (id: string) => void;
  clearAllVariables: () => void;
  getVariableByName: (name: string) => Variable | undefined;
  loadVariables: () => void;
}

const VariablesContext = createContext<VariablesContextType | undefined>(
  undefined
);

export const VariablesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, loading] = useAuthState(auth);
  const userId = user?.uid || user?.email || 'anonymous';
  const variablesHook = useVariables(userId);

  const contextValue = loading
    ? {
        variables: [],
        loading: true,
        addVariable: () => ({ id: '', name: '', value: '' }),
        updateVariable: () => {},
        deleteVariable: () => {},
        clearAllVariables: () => {},
        getVariableByName: () => undefined,
        loadVariables: () => {},
      }
    : variablesHook;

  return (
    <VariablesContext.Provider value={contextValue}>
      {children}
    </VariablesContext.Provider>
  );
};

export const useVariablesContext = (): VariablesContextType => {
  const context = useContext(VariablesContext);
  if (context === undefined) {
    throw new Error(
      'useVariablesContext must be used within a VariablesProvider'
    );
  }
  return context;
};
