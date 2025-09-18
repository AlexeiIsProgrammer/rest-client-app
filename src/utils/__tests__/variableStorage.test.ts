import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  saveVariablesToStorage,
  loadVariablesFromStorage,
  clearVariablesFromStorage,
  clearAllUserVariables,
  substituteVariables,
} from '../variableStorage';
import type { Variable } from '~/routes/variables/types';

vi.mock('~/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('Variable Storage Functions', () => {
  const mockVariables: Variable[] = [
    { id: '1', name: 'host', value: 'api.example.com' },
    { id: '2', name: 'id', value: '123' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveVariablesToStorage and loadVariablesFromStorage', () => {
    it('should save and load variables for a user', () => {
      const userId = 'test-user';

      saveVariablesToStorage(mockVariables, userId);
      const loaded = loadVariablesFromStorage(userId);

      expect(loaded).toEqual(mockVariables);
    });

    it('should handle different users separately', () => {
      const user1Vars = [{ id: '1', name: 'var1', value: 'value1' }];
      const user2Vars = [{ id: '2', name: 'var2', value: 'value2' }];

      saveVariablesToStorage(user1Vars, 'user1');
      saveVariablesToStorage(user2Vars, 'user2');

      expect(loadVariablesFromStorage('user1')).toEqual(user1Vars);
      expect(loadVariablesFromStorage('user2')).toEqual(user2Vars);
    });

    it('should return empty array for non-existent user', () => {
      expect(loadVariablesFromStorage('non-existent-user')).toEqual([]);
    });

    it('should filter out invalid variables', () => {
      const invalidVariables = [
        { id: '1', name: 'valid', value: 'value' },
        { name: 'invalid', value: 'value' },
        { id: '2', value: 'value' },
        { id: '3', name: 'invalid' },
        null,
      ] as Variable[];

      saveVariablesToStorage(invalidVariables, 'test-user');
      const loaded = loadVariablesFromStorage('test-user');

      expect(loaded).toEqual([{ id: '1', name: 'valid', value: 'value' }]);
    });
  });

  describe('clearVariablesFromStorage', () => {
    it('should clear variables for a specific user', () => {
      saveVariablesToStorage(mockVariables, 'user1');
      saveVariablesToStorage(mockVariables, 'user2');

      clearVariablesFromStorage('user1');

      expect(loadVariablesFromStorage('user1')).toEqual([]);
      expect(loadVariablesFromStorage('user2')).toEqual(mockVariables);
    });
  });

  describe('clearAllUserVariables', () => {
    it('should clear all variables for all users', () => {
      saveVariablesToStorage(mockVariables, 'user1');
      saveVariablesToStorage(mockVariables, 'user2');

      clearAllUserVariables();

      expect(loadVariablesFromStorage('user1')).toEqual([]);
      expect(loadVariablesFromStorage('user2')).toEqual([]);
    });
  });

  describe('substituteVariables', () => {
    it('should substitute variables in text', () => {
      const result = substituteVariables(
        'https://{{host}}/users/{{id}}',
        mockVariables
      );
      expect(result).toBe('https://api.example.com/users/123');
    });

    it('should leave unmatched variables as is', () => {
      const result = substituteVariables(
        'https://{{host}}/users/{{unknown}}',
        mockVariables
      );
      expect(result).toBe('https://api.example.com/users/{{unknown}}');
    });

    it('should handle non-string input', () => {
      expect(substituteVariables(null, mockVariables)).toBe('');
      expect(substituteVariables(undefined, mockVariables)).toBe('');
      expect(substituteVariables(123, mockVariables)).toBe('123');
    });

    it('should handle empty variables array', () => {
      const result = substituteVariables('https://{{host}}/users', []);
      expect(result).toBe('https://{{host}}/users');
    });

    it('should handle variables with whitespace', () => {
      const variables = [{ id: '1', name: 'host', value: 'api.example.com' }];
      const result = substituteVariables(
        'https://{{  host  }}/users',
        variables
      );
      expect(result).toBe('https://api.example.com/users');
    });
  });
});
