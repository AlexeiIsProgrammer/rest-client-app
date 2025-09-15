import { substituteVariables } from './variableStorage';
import type { Variable } from '../routes/variables/types';

const validateUrl = (url: string, variables: Variable[] = []): string => {
  if (!url) return 'URL is required';

  const hasVariables = /\{\{[^}]+\}\}/.test(url);

  if (hasVariables) {
    if (variables.length === 0) {
      return '';
    }

    try {
      const substitutedUrl = substituteVariables(url, variables);
      new URL(substitutedUrl);
      return '';
    } catch {
      return 'Please enter a valid URL (variables may have invalid values)';
    }
  } else {
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

export default validateUrl;
