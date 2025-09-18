import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '..';
import { getLocaleName, getLocalizedUrl, Locales } from 'intlayer';
import { useIntlayer, useLocale } from 'react-intlayer';
import { useLocation } from 'react-router';

vi.mock('intlayer', () => ({
  getLocaleName: vi.fn(),
  getLocalizedUrl: vi.fn(),
  Locales: {
    ENGLISH: 'en',
    RUSSIAN: 'ru',
  },
}));

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(),
  useLocale: vi.fn(),
}));

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));

const mockLocationReplace = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    replace: mockLocationReplace,
  },
  writable: true,
});

describe('LanguageSwitcher', () => {
  const mockGetLocaleName = vi.mocked(getLocaleName);
  const mockGetLocalizedUrl = vi.mocked(getLocalizedUrl);
  const mockUseIntlayer = vi.mocked(useIntlayer);
  const mockUseLocale = vi.mocked(useLocale);
  const mockUseLocation = vi.mocked(useLocation);
  const mockSetLocale = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseIntlayer.mockReturnValue({ name: 'Switch Language' });
    mockUseLocation.mockReturnValue({
      pathname: '/current-path',
      search: '?query=test',
      hash: '',
      state: null,
      key: 'test-key',
    });
    mockGetLocalizedUrl.mockReturnValue('/en/current-path?query=test');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the button with correct text', () => {
    mockUseLocale.mockReturnValue({
      locale: Locales.ENGLISH,
      setLocale: mockSetLocale,
    });
    mockGetLocaleName.mockReturnValue('English');

    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Switch Language (English)');
    expect(mockGetLocaleName).toHaveBeenCalledWith(Locales.ENGLISH);
  });

  it('should call setLocale with opposite locale when clicked', () => {
    mockUseLocale.mockReturnValue({
      locale: Locales.ENGLISH,
      setLocale: mockSetLocale,
    });
    mockGetLocaleName.mockReturnValue('English');

    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetLocale).toHaveBeenCalledWith(Locales.RUSSIAN);
  });

  it('should call setLocale with English when current locale is Russian', () => {
    mockUseLocale.mockReturnValue({
      locale: Locales.RUSSIAN,
      setLocale: mockSetLocale,
    });
    mockGetLocaleName.mockReturnValue('Russian');

    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetLocale).toHaveBeenCalledWith(Locales.ENGLISH);
  });

  it('should handle locale change callback with correct URL', () => {
    mockUseLocale.mockImplementation(({ onLocaleChange } = {}) => {
      if (onLocaleChange) {
        onLocaleChange(Locales.ENGLISH);
      }
      return {
        locale: Locales.ENGLISH,
        setLocale: mockSetLocale,
      };
    });

    render(<LanguageSwitcher />);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
      '/current-path?query=test',
      Locales.ENGLISH
    );
  });

  it('should replace location when locale changes', () => {
    const newLocale = Locales.ENGLISH;
    const expectedUrl = '/en/current-path?query=test';

    mockUseLocale.mockImplementation(({ onLocaleChange } = {}) => {
      if (onLocaleChange) {
        onLocaleChange(newLocale);
      }
      return {
        locale: Locales.ENGLISH,
        setLocale: mockSetLocale,
      };
    });
    mockGetLocalizedUrl.mockReturnValue(expectedUrl);

    render(<LanguageSwitcher />);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
      '/current-path?query=test',
      newLocale
    );
    expect(mockLocationReplace).toHaveBeenCalledWith(expectedUrl);
  });

  it('should handle different pathnames and search params', () => {
    const testCases = [
      { pathname: '/', search: '', expectedInput: '/', expectedOutput: '/en' },
      {
        pathname: '/about',
        search: '',
        expectedInput: '/about',
        expectedOutput: '/en/about',
      },
      {
        pathname: '/contact',
        search: '?id=123',
        expectedInput: '/contact?id=123',
        expectedOutput: '/en/contact?id=123',
      },
      {
        pathname: '/products',
        search: '?category=books&page=2',
        expectedInput: '/products?category=books&page=2',
        expectedOutput: '/en/products?category=books&page=2',
      },
    ];

    testCases.forEach(({ pathname, search, expectedInput, expectedOutput }) => {
      vi.clearAllMocks();
      mockUseLocation.mockReturnValue({
        pathname,
        search,
        hash: '',
        state: null,
        key: 'test-key',
      });
      mockUseIntlayer.mockReturnValue({ name: 'Switch Language' });
      mockGetLocalizedUrl.mockReturnValue(expectedOutput);
      mockLocationReplace.mockClear();

      mockUseLocale.mockImplementation(({ onLocaleChange } = {}) => {
        if (onLocaleChange) {
          onLocaleChange(Locales.ENGLISH);
        }
        return {
          locale: Locales.ENGLISH,
          setLocale: mockSetLocale,
        };
      });

      render(<LanguageSwitcher />);

      expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
        expectedInput,
        Locales.ENGLISH
      );
      expect(mockLocationReplace).toHaveBeenCalledWith(expectedOutput);
    });
  });

  it('should use the correct button variant and size', () => {
    mockUseLocale.mockReturnValue({
      locale: Locales.ENGLISH,
      setLocale: mockSetLocale,
    });
    mockGetLocaleName.mockReturnValue('English');

    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-outlined');
    expect(button).toHaveClass('MuiButton-sizeMedium');
  });

  it('should handle empty search string', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      state: null,
      key: 'test-key',
    });
    mockGetLocalizedUrl.mockReturnValue('/en/test');

    mockUseLocale.mockImplementation(({ onLocaleChange } = {}) => {
      if (onLocaleChange) {
        onLocaleChange(Locales.ENGLISH);
      }
      return {
        locale: Locales.ENGLISH,
        setLocale: mockSetLocale,
      };
    });

    render(<LanguageSwitcher />);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith('/test', Locales.ENGLISH);
    expect(mockLocationReplace).toHaveBeenCalledWith('/en/test');
  });

  it('should handle hash in URL', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/test',
      search: '?query=1',
      hash: '#section',
      state: null,
      key: 'test-key',
    });
    mockGetLocalizedUrl.mockReturnValue('/en/test?query=1#section');

    mockUseLocale.mockImplementation(({ onLocaleChange } = {}) => {
      if (onLocaleChange) {
        onLocaleChange(Locales.ENGLISH);
      }
      return {
        locale: Locales.ENGLISH,
        setLocale: mockSetLocale,
      };
    });

    render(<LanguageSwitcher />);

    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
      '/test?query=1',
      Locales.ENGLISH
    );
  });
});
