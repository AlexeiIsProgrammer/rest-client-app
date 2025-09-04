export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\p{P}\p{S}]).{8,}$/u;
  return regex.test(password);
}
