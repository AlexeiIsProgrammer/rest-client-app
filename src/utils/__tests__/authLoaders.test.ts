import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { requireGuestLoader, requireAuthLoader } from '../authLoaders';
import { getUserFromRequest } from '../auth.server';
import { redirect } from 'react-router';

vi.mock('../auth.server', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('react-router', () => ({
  redirect: vi.fn((path: string) => {
    return new Response(null, {
      status: 302,
      headers: { Location: path },
    });
  }),
}));
describe('Authentication Loaders', () => {
  const mockRequest = new Request('https://example.com');
  const mockUser = {
    uid: 'user123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requireGuestLoader', () => {
    it('should redirect to home if user is authenticated', async () => {
      (getUserFromRequest as Mock).mockResolvedValue(mockUser);
      (redirect as Mock).mockReturnValue(
        new Response(null, { status: 302, headers: { Location: '/' } })
      );

      const result = await requireGuestLoader({ request: mockRequest });

      expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
      expect(redirect).toHaveBeenCalledWith('/');
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(302);
      expect(result?.headers.get('Location')).toBe('/');
    });

    it('should return undefined if user is not authenticated', async () => {
      (getUserFromRequest as Mock).mockResolvedValue(null);

      const result = await requireGuestLoader({ request: mockRequest });

      expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
      expect(redirect).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle errors from getUserFromRequest gracefully', async () => {
      (getUserFromRequest as Mock).mockRejectedValue(new Error('Auth error'));
      let result;
      try {
        result = await requireGuestLoader({ request: mockRequest });
      } catch {
        expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
        expect(redirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      }
    });
  });

  describe('requireAuthLoader', () => {
    it('should redirect to main if user is not authenticated', async () => {
      (getUserFromRequest as Mock).mockResolvedValue(null);
      (redirect as Mock).mockReturnValue(
        new Response(null, { status: 302, headers: { Location: '/' } })
      );

      const result = await requireAuthLoader({ request: mockRequest });

      expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
      expect(redirect).toHaveBeenCalledWith('/');
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(302);
      expect(result.headers.get('Location')).toBe('/');
    });

    it('should return user if user is authenticated', async () => {
      (getUserFromRequest as Mock).mockResolvedValue(mockUser);

      const result = await requireAuthLoader({ request: mockRequest });

      expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
      expect(redirect).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
