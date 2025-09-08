const validateUrl = (url: string): string => {
  if (!url) return 'URL is required';
  try {
    new URL(url);
    return '';
  } catch {
    return 'Please enter a valid URL';
  }
};

export default validateUrl;
