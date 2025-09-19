import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserFromRequest } from '../auth.server';

export const adminAuth = {
  verifyIdToken: vi.fn(),
};

vi.mock('../../firebaseAdmin.server', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
  },
}));

describe('auth.server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no cookie is present', async () => {
    const request = new Request('https://example.com', {
      headers: {},
    });

    const result = await getUserFromRequest(request);
    expect(result).toBeNull();
  });

  it('should return null when no session cookie is present', async () => {
    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'other-cookie=value; another-cookie=value2',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toBeNull();
  });

  it('should return null when session cookie is empty', async () => {
    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'session=; other-cookie=value',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toBeNull();
  });
});
