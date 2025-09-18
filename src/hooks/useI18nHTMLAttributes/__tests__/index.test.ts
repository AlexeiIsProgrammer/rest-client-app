import { renderHook } from '@testing-library/react';
import { useI18nHTMLAttributes } from '..';
import { getHTMLTextDir } from 'intlayer';
import { useLocale } from 'react-intlayer';

vi.mock('intlayer', () => ({
  getHTMLTextDir: vi.fn(),
}));

vi.mock('react-intlayer', () => ({
  useLocale: vi.fn(),
}));

describe('useI18nHTMLAttributes', () => {
  const mockGetHTMLTextDir = vi.mocked(getHTMLTextDir);
  const mockUseLocale = vi.mocked(useLocale);

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.lang = '';
    document.documentElement.dir = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set lang and dir attributes on mount', () => {
    const mockLocale = 'en-US';
    const mockDir = 'ltr';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetHTMLTextDir.mockReturnValue(mockDir);

    renderHook(() => useI18nHTMLAttributes());

    expect(document.documentElement.lang).toBe(mockLocale);
    expect(document.documentElement.dir).toBe(mockDir);
    expect(mockGetHTMLTextDir).toHaveBeenCalledWith(mockLocale);
  });

  it('should update attributes when locale changes', () => {
    const initialLocale = 'en-US';
    const initialDir = 'ltr';
    const updatedLocale = 'ar-SA';
    const updatedDir = 'rtl';

    mockUseLocale
      .mockReturnValueOnce({ locale: initialLocale })
      .mockReturnValueOnce({ locale: updatedLocale });

    mockGetHTMLTextDir
      .mockReturnValueOnce(initialDir)
      .mockReturnValueOnce(updatedDir);

    const { rerender } = renderHook(() => useI18nHTMLAttributes());

    expect(document.documentElement.lang).toBe(initialLocale);
    expect(document.documentElement.dir).toBe(initialDir);

    rerender();

    expect(document.documentElement.lang).toBe(updatedLocale);
    expect(document.documentElement.dir).toBe(updatedDir);
    expect(mockGetHTMLTextDir).toHaveBeenCalledTimes(2);
    expect(mockGetHTMLTextDir).toHaveBeenCalledWith(updatedLocale);
  });

  it('should handle different locale formats correctly', () => {
    const testCases = [
      { locale: 'fr-FR', expectedDir: 'ltr' },
      { locale: 'he-IL', expectedDir: 'rtl' },
      { locale: 'ja-JP', expectedDir: 'ltr' },
      { locale: 'fa-IR', expectedDir: 'rtl' },
    ];

    testCases.forEach(({ locale, expectedDir }) => {
      vi.clearAllMocks();
      document.documentElement.lang = '';
      document.documentElement.dir = '';

      mockUseLocale.mockReturnValue({ locale });
      mockGetHTMLTextDir.mockReturnValue(expectedDir);

      renderHook(() => useI18nHTMLAttributes());

      expect(document.documentElement.lang).toBe(locale);
      expect(document.documentElement.dir).toBe(expectedDir);
      expect(mockGetHTMLTextDir).toHaveBeenCalledWith(locale);
    });
  });

  it('should not update attributes if locale remains the same', () => {
    const mockLocale = 'en-US';
    const mockDir = 'ltr';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetHTMLTextDir.mockReturnValue(mockDir);

    const { rerender } = renderHook(() => useI18nHTMLAttributes());

    const initialLang = document.documentElement.lang;
    const initialDir = document.documentElement.dir;

    rerender();

    expect(document.documentElement.lang).toBe(initialLang);
    expect(document.documentElement.dir).toBe(initialDir);
    expect(mockGetHTMLTextDir).toHaveBeenCalledTimes(1);
  });

  it('should call getHTMLTextDir with the correct locale', () => {
    const mockLocale = 'es-ES';
    const mockDir = 'ltr';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetHTMLTextDir.mockReturnValue(mockDir);

    renderHook(() => useI18nHTMLAttributes());

    expect(mockGetHTMLTextDir).toHaveBeenCalledWith(mockLocale);
    expect(mockGetHTMLTextDir).toHaveBeenCalledTimes(1);
  });

  it('should handle empty string locale', () => {
    const mockLocale = '';
    const mockDir = 'ltr';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetHTMLTextDir.mockReturnValue(mockDir);

    renderHook(() => useI18nHTMLAttributes());

    expect(document.documentElement.lang).toBe(mockLocale);
    expect(document.documentElement.dir).toBe(mockDir);
  });
});
