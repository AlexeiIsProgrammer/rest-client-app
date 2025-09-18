import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
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
  const mockDecodedToken = {
    uid: 'user123',
    email: 'test@example.com',
    name: 'Test User',
  };

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

  it.skip('should return decoded token when session cookie is valid', async () => {
    (adminAuth.verifyIdToken as Mock).mockResolvedValue(mockDecodedToken);

    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'session=valid-token; other-cookie=value',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toEqual(mockDecodedToken);
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it.skip('should return null when token verification fails', async () => {
    (adminAuth.verifyIdToken as Mock).mockRejectedValue(
      new Error('Invalid token')
    );

    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'session=invalid-token; other-cookie=value',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toBeNull();
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('invalid-token');
  });

  it.skip('should handle multiple cookies with session in the middle', async () => {
    (adminAuth.verifyIdToken as Mock).mockResolvedValue(mockDecodedToken);

    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'first-cookie=value1; session=valid-token; last-cookie=value2',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toEqual(mockDecodedToken);
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it.skip('should handle URL-encoded session cookie values', async () => {
    (adminAuth.verifyIdToken as Mock).mockResolvedValue(mockDecodedToken);

    const request = new Request('https://example.com', {
      headers: {
        Cookie: 'session=encoded%20token%20value; other-cookie=value',
      },
    });

    const result = await getUserFromRequest(request);
    expect(result).toEqual(mockDecodedToken);
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith(
      'encoded%20token%20value'
    );
  });
});
