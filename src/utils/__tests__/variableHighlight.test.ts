import { describe, it, expect } from 'vitest';
import {
  hasVariables,
  extractVariableNames,
  countVariables,
} from '../variableHighlight';

describe('Variable Highlight Functions', () => {
  describe('hasVariables', () => {
    it('should return true for text with variables', () => {
      expect(hasVariables('https://{{host}}/users/{{id}}')).toBe(true);
      expect(hasVariables('Hello {{name}}!')).toBe(true);
      expect(hasVariables('{{variable}}')).toBe(true);
    });

    it('should return false for text without variables', () => {
      expect(hasVariables('https://api.example.com/users')).toBe(false);
      expect(hasVariables('Hello world!')).toBe(false);
      expect(hasVariables('')).toBe(false);
    });
  });

  describe('extractVariableNames', () => {
    it('should extract variable names from text', () => {
      expect(extractVariableNames('https://{{host}}/users/{{id}}')).toEqual([
        'host',
        'id',
      ]);
      expect(extractVariableNames('Hello {{name}}! Today is {{day}}.')).toEqual(
        ['name', 'day']
      );
    });

    it('should handle variables with different characters', () => {
      expect(
        extractVariableNames('{{var_name}} {{var-name}} {{var.name}}')
      ).toEqual(['var_name', 'var-name', 'var.name']);
    });

    it('should return empty array for text without variables', () => {
      expect(extractVariableNames('No variables here')).toEqual([]);
      expect(extractVariableNames('')).toEqual([]);
    });

    it('should trim whitespace from variable names', () => {
      expect(extractVariableNames('{{  name  }} {{  value  }}')).toEqual([
        'name',
        'value',
      ]);
    });
  });

  describe('countVariables', () => {
    it('should count variables in text', () => {
      expect(countVariables('https://{{host}}/users/{{id}}')).toBe(2);
      expect(countVariables('Hello {{name}}! Today is {{day}}.')).toBe(2);
      expect(countVariables('{{var1}}{{var2}}{{var3}}')).toBe(3);
    });

    it('should return 0 for text without variables', () => {
      expect(countVariables('No variables here')).toBe(0);
      expect(countVariables('')).toBe(0);
    });

    it('should handle variables with Unicode characters', () => {
      expect(countVariables('Hello {{var1}}! Today is {{var2}}.')).toBe(2);
    });
  });
});
