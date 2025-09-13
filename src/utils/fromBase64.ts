const fromBase64 = (s: string) => {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
};

export default fromBase64;
