import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadVariablesFromStorage,
  saveVariablesToStorage,
  clearVariablesFromStorage,
  substituteVariables,
  clearAllUserVariables,
} from '../variableStorage';
import {
  hasVariables,
  extractVariableNames,
  countVariables,
} from '../variableHighlight';
import fromBase64 from '../fromBase64';
import toBase64 from '../toBase64';
import type { Variable } from '~/routes/variables/types';

describe('variableHighlight', () => {
  it('should detect variables in text', () => {
    expect(hasVariables('{{test}}')).toBe(true);
    expect(hasVariables('no variables')).toBe(false);
    expect(hasVariables('{{var1}} and {{var2}}')).toBe(true);
  });

  it('should extract variable names from text', () => {
    expect(extractVariableNames('{{test}}')).toEqual(['test']);
    expect(extractVariableNames('{{var1}} and {{var2}}')).toEqual([
      'var1',
      'var2',
    ]);
    expect(extractVariableNames('no variables')).toEqual([]);
  });

  it('should count variables in text', () => {
    expect(countVariables('{{test}}')).toBe(1);
    expect(countVariables('{{var1}} and {{var2}}')).toBe(2);
    expect(countVariables('no variables')).toBe(0);
  });
});

describe('variableStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load variables from storage', () => {
    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];
    saveVariablesToStorage(testVariables, 'test-user');

    const loaded = loadVariablesFromStorage('test-user');
    expect(loaded).toEqual(testVariables);
  });

  it('should save variables to storage', () => {
    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];

    saveVariablesToStorage(testVariables, 'test-user');
    const allVariables = JSON.parse(
      localStorage.getItem('rest-client-variables') || '{}'
    );
    expect(allVariables['test-user']).toEqual(testVariables);
  });

  it('should clear variables from storage', () => {
    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];
    saveVariablesToStorage(testVariables, 'test-user');

    clearVariablesFromStorage('test-user');
    const cleared = loadVariablesFromStorage('test-user');
    expect(cleared).toEqual([]);
  });

  it('should substitute variables in text', () => {
    const variables: Variable[] = [
      { id: '1', name: 'api_url', value: 'https://api.example.com' },
      { id: '2', name: 'user_id', value: '123' },
    ];

    expect(
      substituteVariables('{{api_url}}/users/{{user_id}}', variables)
    ).toBe('https://api.example.com/users/123');

    expect(substituteVariables('no variables', variables)).toBe('no variables');
  });

  it('should handle non-string input in substituteVariables', () => {
    const variables: Variable[] = [{ id: '1', name: 'test', value: 'value' }];

    expect(substituteVariables(null, variables)).toBe('');
    expect(substituteVariables(undefined, variables)).toBe('');
    expect(substituteVariables(123, variables)).toBe('123');
    expect(substituteVariables({}, variables)).toBe('[object Object]');
  });

  it('should handle variables with whitespace in substituteVariables', () => {
    const variables: Variable[] = [{ id: '1', name: 'test', value: 'value' }];

    expect(substituteVariables('{{ test }}', variables)).toBe('value');
    expect(substituteVariables('{{  test  }}', variables)).toBe('value');
  });

  it('should handle missing variables in substituteVariables', () => {
    const variables: Variable[] = [{ id: '1', name: 'test', value: 'value' }];

    expect(substituteVariables('{{missing}}', variables)).toBe('{{missing}}');
    expect(substituteVariables('{{test}} and {{missing}}', variables)).toBe(
      'value and {{missing}}'
    );
  });

  it('should clear all user variables', () => {
    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];
    saveVariablesToStorage(testVariables, 'test-user');

    clearAllUserVariables();

    const cleared = loadVariablesFromStorage('test-user');
    expect(cleared).toEqual([]);
  });

  it('should handle localStorage errors gracefully in loadVariablesFromStorage', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    const result = loadVariablesFromStorage('test-user');
    expect(result).toEqual([]);

    localStorage.getItem = originalGetItem;
  });

  it('should handle localStorage errors gracefully in saveVariablesToStorage', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];

    expect(() => {
      saveVariablesToStorage(testVariables, 'test-user');
    }).not.toThrow();

    localStorage.setItem = originalSetItem;
  });

  it('should handle localStorage errors gracefully in clearVariablesFromStorage', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    expect(() => {
      clearVariablesFromStorage('test-user');
    }).not.toThrow();

    localStorage.getItem = originalGetItem;
  });

  it('should handle localStorage errors gracefully in clearAllUserVariables', () => {
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    expect(() => {
      clearAllUserVariables();
    }).not.toThrow();

    localStorage.removeItem = originalRemoveItem;
  });

  it('should handle malformed JSON in localStorage', () => {
    localStorage.setItem('rest-client-variables', 'invalid json');

    const result = loadVariablesFromStorage('test-user');
    expect(result).toEqual([]);
  });

  it('should handle array format in localStorage (legacy support)', () => {
    const legacyVariables = [{ id: '1', name: 'test', value: 'value' }];
    localStorage.setItem(
      'rest-client-variables',
      JSON.stringify(legacyVariables)
    );

    const result = loadVariablesFromStorage('legacy');
    expect(result).toEqual(legacyVariables);
  });

  it('should filter out invalid variables', () => {
    const invalidVariables = [
      { id: '1', name: 'valid', value: 'value' },
      { id: '', name: 'invalid', value: 'value' },
      { name: 'invalid2', value: 'value' },
      { id: '3', value: 'value' },
      { id: '4', name: 'invalid4' },
      null,
      'string',
    ];

    localStorage.setItem(
      'rest-client-variables',
      JSON.stringify({ 'test-user': invalidVariables })
    );

    const result = loadVariablesFromStorage('test-user');
    expect(result).toEqual([
      { id: '1', name: 'valid', value: 'value' },
      { id: '', name: 'invalid', value: 'value' },
    ]);
  });

  it('should handle different user states', () => {
    const result1 = loadVariablesFromStorage('fallback-user');
    expect(result1).toEqual([]);

    const result2 = loadVariablesFromStorage('anonymous');
    expect(result2).toEqual([]);
  });

  it('should handle non-object values in localStorage', () => {
    localStorage.setItem('rest-client-variables', 'null');

    const result = loadVariablesFromStorage('test-user');
    expect(result).toEqual([]);
  });

  it('should handle empty localStorage', () => {
    localStorage.removeItem('rest-client-variables');

    const result = loadVariablesFromStorage('test-user');
    expect(result).toEqual([]);
  });

  it('should handle variables with special characters in substituteVariables', () => {
    const variables: Variable[] = [
      { id: '1', name: 'special', value: 'value with spaces and symbols!@#' },
    ];

    expect(substituteVariables('{{special}}', variables)).toBe(
      'value with spaces and symbols!@#'
    );
  });

  it('should handle multiple occurrences of the same variable', () => {
    const variables: Variable[] = [
      { id: '1', name: 'api', value: 'https://api.example.com' },
    ];

    expect(
      substituteVariables('{{api}}/users and {{api}}/posts', variables)
    ).toBe('https://api.example.com/users and https://api.example.com/posts');
  });

  it('should handle nested variable patterns', () => {
    const variables: Variable[] = [
      { id: '1', name: 'base', value: 'api' },
      { id: '2', name: 'api', value: 'https://example.com' },
    ];

    expect(substituteVariables('{{base}} and {{api}}', variables)).toBe(
      'api and https://example.com'
    );
  });

  it('should handle edge cases in substituteVariables', () => {
    const variables: Variable[] = [{ id: '1', name: 'test', value: 'value' }];

    expect(substituteVariables('', variables)).toBe('');

    expect(substituteVariables('   ', variables)).toBe('   ');

    expect(substituteVariables('prefix {{test}} suffix', variables)).toBe(
      'prefix value suffix'
    );
  });

  it('should handle localStorage errors in saveVariablesToStorage error path', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('getItem error');
    });

    const testVariables: Variable[] = [
      { id: '1', name: 'test', value: 'value' },
    ];

    expect(() => {
      saveVariablesToStorage(testVariables, 'test-user');
    }).not.toThrow();

    localStorage.getItem = originalGetItem;
  });
});

describe('base64 utilities', () => {
  it('should encode string to base64', () => {
    expect(toBase64('hello world')).toBe('aGVsbG8gd29ybGQ=');
    expect(toBase64('test')).toBe('dGVzdA==');
    expect(toBase64('')).toBe('');
  });

  it('should decode base64 string', () => {
    expect(fromBase64('aGVsbG8gd29ybGQ=')).toBe('hello world');
    expect(fromBase64('dGVzdA==')).toBe('test');
    expect(fromBase64('')).toBe('');
  });

  it('should handle URL-safe base64 encoding/decoding', () => {
    const original = 'hello+world/test';
    const encoded = toBase64(original);
    const decoded = fromBase64(encoded);

    expect(decoded).toBe(original);
  });
});
