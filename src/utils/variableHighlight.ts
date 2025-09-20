export const hasVariables = (text: string): boolean => {
  return /\{\{[^}]+\}\}/.test(text);
};

export const extractVariableNames = (text: string): string[] => {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];

  return matches.map((match) => match.replace(/[{}]/g, '').trim());
};

export const countVariables = (text: string): number => {
  const matches = text.match(/\{\{\s*([\p{L}\p{N}_\-.]+)\s*\}\}/gu);
  return matches ? matches.length : 0;
};
