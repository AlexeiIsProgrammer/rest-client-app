const toBase64 = (s: string) => {
  const base64 = btoa(s);
  return base64.replace(/\+/g, '-').replace(/\//g, '_');
};

export default toBase64;
