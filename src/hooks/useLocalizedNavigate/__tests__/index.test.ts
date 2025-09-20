import { renderHook } from '@testing-library/react';
import { useLocalizedNavigate } from '..';
import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { useNavigate } from 'react-router';

vi.mock('intlayer', () => ({
  getLocalizedUrl: vi.fn(),
}));

vi.mock('react-intlayer', () => ({
  useLocale: vi.fn(),
}));

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('useLocalizedNavigate', () => {
  const mockGetLocalizedUrl = vi.mocked(getLocalizedUrl);
  const mockUseLocale = vi.mocked(useLocale);
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a function', () => {
    mockUseLocale.mockReturnValue({ locale: 'en-US' });
    mockGetLocalizedUrl.mockReturnValue('/en/test');

    const { result } = renderHook(() => useLocalizedNavigate());

    expect(typeof result.current).toBe('function');
  });

  it('should navigate to localized internal URLs', () => {
    const mockLocale = 'en-US';
    const internalUrl = '/test';
    const localizedUrl = '/en/test';
    const options = { replace: true };

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(internalUrl, options);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(internalUrl, mockLocale);
    expect(mockNavigate).toHaveBeenCalledWith(localizedUrl, options);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to external URLs without localization', () => {
    const mockLocale = 'en-US';
    const externalUrl = 'https://example.com/test';
    const options = { replace: false };

    mockUseLocale.mockReturnValue({ locale: mockLocale });

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(externalUrl, options);

    expect(mockGetLocalizedUrl).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(externalUrl, options);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should handle internal URLs with different locales', () => {
    const testCases = [
      { locale: 'en-US', internalUrl: '/test', expectedUrl: '/en/test' },
      { locale: 'es-ES', internalUrl: '/test', expectedUrl: '/es/test' },
      { locale: 'fr-FR', internalUrl: '/about', expectedUrl: '/fr/about' },
      { locale: 'de-DE', internalUrl: '/contact', expectedUrl: '/de/contact' },
    ];

    testCases.forEach(({ locale, internalUrl, expectedUrl }) => {
      vi.clearAllMocks();
      mockUseLocale.mockReturnValue({ locale });
      mockGetLocalizedUrl.mockReturnValue(expectedUrl);
      mockUseNavigate.mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useLocalizedNavigate());

      result.current(internalUrl);

      expect(mockGetLocalizedUrl).toHaveBeenCalledWith(internalUrl, locale);
      expect(mockNavigate).toHaveBeenCalledWith(expectedUrl, undefined);
    });
  });

  it('should handle navigate options correctly', () => {
    const mockLocale = 'en-US';
    const internalUrl = '/test';
    const localizedUrl = '/en/test';
    const options = { replace: true, state: { from: '/home' } };

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(internalUrl, options);

    expect(mockNavigate).toHaveBeenCalledWith(localizedUrl, options);
  });

  it('should handle undefined options', () => {
    const mockLocale = 'en-US';
    const internalUrl = '/test';
    const localizedUrl = '/en/test';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(internalUrl);

    expect(mockNavigate).toHaveBeenCalledWith(localizedUrl, undefined);
  });

  it('should handle empty string URL', () => {
    const mockLocale = 'en-US';
    const emptyUrl = '';
    const localizedUrl = '/en';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(emptyUrl);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(emptyUrl, mockLocale);
    expect(mockNavigate).toHaveBeenCalledWith(localizedUrl, undefined);
  });

  it('should handle root path internal URLs', () => {
    const mockLocale = 'en-US';
    const rootUrl = '/';
    const localizedUrl = '/en';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    const { result } = renderHook(() => useLocalizedNavigate());

    result.current(rootUrl);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(rootUrl, mockLocale);
    expect(mockNavigate).toHaveBeenCalledWith(localizedUrl, undefined);
  });
});
