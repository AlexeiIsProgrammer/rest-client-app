import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';
import validateUrl from '../validateUrl';
import { substituteVariables } from '../variableStorage';
import type { Variable } from '../../routes/variables/types';

vi.mock('../variableStorage', () => ({
  substituteVariables: vi.fn(),
}));

describe('validateUrl', () => {
  const mockSubstituteVariables = substituteVariables as MockedFunction<
    typeof substituteVariables
  >;
  const mockVariables: Variable[] = [
    { id: '1', name: 'host', value: 'api.example.com' },
    { id: '2', name: 'id', value: '123' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error for empty URL', () => {
    const result = validateUrl('');
    expect(result).toBe('URL is required');
  });

  it('should return empty string for valid URL without variables', () => {
    const result = validateUrl('https://api.example.com/users');
    expect(result).toBe('');
  });

  it('should return error for invalid URL without variables', () => {
    const result = validateUrl('invalid-url');
    expect(result).toBe('Please enter a valid URL');
  });

  it('should return empty string for URL with variables when no variables provided', () => {
    const result = validateUrl('https://{{host}}/users/{{id}}', []);
    expect(result).toBe('');
  });

  it('should return empty string for valid URL with valid variable substitution', () => {
    mockSubstituteVariables.mockReturnValue(
      'https://api.example.com/users/123'
    );

    const result = validateUrl('https://{{host}}/users/{{id}}', mockVariables);

    expect(mockSubstituteVariables).toHaveBeenCalledWith(
      'https://{{host}}/users/{{id}}',
      mockVariables
    );
    expect(result).toBe('');
  });

  it('should return error for invalid URL after variable substitution', () => {
    mockSubstituteVariables.mockReturnValue('invalid-url-after-substitution');

    const result = validateUrl('https://{{host}}/users/{{id}}', mockVariables);

    expect(mockSubstituteVariables).toHaveBeenCalledWith(
      'https://{{host}}/users/{{id}}',
      mockVariables
    );
    expect(result).toBe(
      'Please enter a valid URL (variables may have invalid values)'
    );
  });

  it('should handle complex URL with multiple variables', () => {
    mockSubstituteVariables.mockReturnValue(
      'https://api.example.com/users/123/posts/456'
    );

    const result = validateUrl(
      'https://{{host}}/users/{{userId}}/posts/{{postId}}',
      [
        { id: '1', name: 'host', value: 'api.example.com' },
        { id: '2', name: 'userId', value: '123' },
        { id: '3', name: 'postId', value: '456' },
      ]
    );

    expect(result).toBe('');
  });

  it('should handle URL with protocol variable', () => {
    mockSubstituteVariables.mockReturnValue('https://api.example.com');

    const result = validateUrl('{{protocol}}://api.example.com', [
      { id: '1', name: 'protocol', value: 'https' },
    ]);

    expect(result).toBe('');
  });

  it('should handle URL with port variable', () => {
    mockSubstituteVariables.mockReturnValue('https://api.example.com:8080');

    const result = validateUrl('https://api.example.com:{{port}}', [
      { id: '1', name: 'port', value: '8080' },
    ]);

    expect(result).toBe('');
  });

  it('should handle URL with path variable containing special characters', () => {
    mockSubstituteVariables.mockReturnValue(
      'https://api.example.com/users/test%20user'
    );

    const result = validateUrl('https://api.example.com/users/{{username}}', [
      { id: '1', name: 'username', value: 'test%20user' },
    ]);

    expect(result).toBe('');
  });
});
