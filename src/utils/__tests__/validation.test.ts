import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from '../validation';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@example.co.uk')).toBe(true);
    expect(validateEmail('first.last@subdomain.example.org')).toBe(true);
    expect(validateEmail('email123@test-domain.com')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('user@domain.')).toBe(false);
    expect(validateEmail('user name@example.com')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should return true for valid passwords', () => {
    expect(validatePassword('Password123!')).toBe(true);
    expect(validatePassword('Secure@123')).toBe(true);
    expect(validatePassword('Test#1234')).toBe(true);
    expect(validatePassword('LongPassword123$')).toBe(true);
  });

  it('should return false for passwords without letters', () => {
    expect(validatePassword('12345678!')).toBe(false);
  });

  it('should return false for passwords without numbers', () => {
    expect(validatePassword('Password!@#')).toBe(false);
  });

  it('should return false for passwords without special characters', () => {
    expect(validatePassword('Password123')).toBe(false);
  });

  it('should return false for passwords shorter than 8 characters', () => {
    expect(validatePassword('Pass1!')).toBe(false);
  });

  it('should return false for empty password', () => {
    expect(validatePassword('')).toBe(false);
  });
});
