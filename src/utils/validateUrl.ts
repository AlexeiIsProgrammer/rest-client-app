import { substituteVariables } from './variableStorage';
import type { Variable } from '../routes/variables/types';

const validateUrl = (url: string, variables: Variable[] = []): string => {
  if (!url) return 'URL is required';

  const hasVariables = /\{\{[^}]+\}\}/.test(url);
  console.log('validateUrl - hasVariables:', url, hasVariables);

  if (hasVariables) {
    // If URL has variables but no variables provided, it's still valid for now
    if (variables.length === 0) {
      return '';
    }

    // Try to substitute variables and validate the result
    try {
      const substitutedUrl = substituteVariables(url, variables);
      new URL(substitutedUrl);
      return '';
    } catch {
      return 'Please enter a valid URL (variables may have invalid values)';
    }
  } else {
    // No variables, validate the URL directly
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

export default validateUrl;
