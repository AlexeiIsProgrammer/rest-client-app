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
  const [user] = useAuthState(auth);
  const userId = user?.uid || user?.email || '';
  const variablesHook = useVariables(userId);

  return (
    <VariablesContext.Provider value={variablesHook}>
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
