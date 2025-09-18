import { render, screen } from '@testing-library/react';
import LocalizedLink from '..';
import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'react-intlayer';
import { Link } from 'react-router';

vi.mock('intlayer', () => ({
  getLocalizedUrl: vi.fn(),
}));

vi.mock('react-intlayer', () => ({
  useLocale: vi.fn(),
}));

vi.mock('react-router', () => ({
  Link: vi.fn(({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  )),
}));

describe('LocalizedLink', () => {
  const mockGetLocalizedUrl = vi.mocked(getLocalizedUrl);
  const mockUseLocale = vi.mocked(useLocale);
  const MockLink = vi.mocked(Link);

  beforeEach(() => {
    vi.clearAllMocks();
    MockLink.mockImplementation(({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render Link component with localized internal URL', () => {
    const mockLocale = 'en-US';
    const internalUrl = '/about';
    const localizedUrl = '/en/about';
    const linkText = 'About Us';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={internalUrl}>{linkText}</LocalizedLink>);

    const link = screen.getByText(linkText);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(internalUrl, mockLocale);
  });

  it('should render Link component with external URL unchanged', () => {
    const mockLocale = 'en-US';
    const externalUrl = 'https://example.com/about';
    const linkText = 'External Link';

    mockUseLocale.mockReturnValue({ locale: mockLocale });

    render(<LocalizedLink to={externalUrl}>{linkText}</LocalizedLink>);

    const link = screen.getByText(linkText);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', externalUrl);
    expect(mockGetLocalizedUrl).not.toHaveBeenCalled();
  });

  it('should handle various external URL formats without localization', () => {
    const mockLocale = 'en-US';
    const testCases = [
      'https://example.com/test',
      'http://example.com/test',
      '//example.com/test',
    ];

    mockUseLocale.mockReturnValue({ locale: mockLocale });

    testCases.forEach((externalUrl) => {
      vi.clearAllMocks();
      mockUseLocale.mockReturnValue({ locale: mockLocale });

      const { unmount } = render(
        <LocalizedLink to={externalUrl}>Link</LocalizedLink>
      );

      const link = screen.getByText('Link');
      expect(link).toHaveAttribute('href', externalUrl);
      expect(mockGetLocalizedUrl).not.toHaveBeenCalled();

      unmount();
    });
  });

  it('should pass all additional props to Link component', () => {
    const mockLocale = 'en-US';
    const internalUrl = '/contact';
    const localizedUrl = '/en/contact';
    const className = 'custom-class';
    const id = 'test-id';
    const target = '_blank';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(
      <LocalizedLink
        to={internalUrl}
        className={className}
        id={id}
        target={target}
        data-testid="custom-link"
      >
        Contact
      </LocalizedLink>
    );

    const link = screen.getByTestId('custom-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(link).toHaveClass(className);
    expect(link).toHaveAttribute('id', id);
    expect(link).toHaveAttribute('target', target);
  });

  it('should handle different locales correctly', () => {
    const testCases = [
      { locale: 'en-US', internalUrl: '/about', localizedUrl: '/en/about' },
      { locale: 'es-ES', internalUrl: '/about', localizedUrl: '/es/about' },
      { locale: 'fr-FR', internalUrl: '/contact', localizedUrl: '/fr/contact' },
      {
        locale: 'de-DE',
        internalUrl: '/products',
        localizedUrl: '/de/products',
      },
    ];

    testCases.forEach(({ locale, internalUrl, localizedUrl }) => {
      vi.clearAllMocks();
      mockUseLocale.mockReturnValue({ locale });
      mockGetLocalizedUrl.mockReturnValue(localizedUrl);

      const { unmount } = render(
        <LocalizedLink to={internalUrl}>Test</LocalizedLink>
      );

      const link = screen.getByText('Test');
      expect(link).toHaveAttribute('href', localizedUrl);
      expect(mockGetLocalizedUrl).toHaveBeenCalledWith(internalUrl, locale);

      unmount();
    });
  });

  it('should handle empty string URL', () => {
    const mockLocale = 'en-US';
    const emptyUrl = '';
    const localizedUrl = '/en';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={emptyUrl}>Home</LocalizedLink>);

    const link = screen.getByText('Home');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(emptyUrl, mockLocale);
  });

  it('should handle root path URL', () => {
    const mockLocale = 'en-US';
    const rootUrl = '/';
    const localizedUrl = '/en';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={rootUrl}>Home</LocalizedLink>);

    const link = screen.getByText('Home');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(rootUrl, mockLocale);
  });

  it('should handle URL with query parameters', () => {
    const mockLocale = 'en-US';
    const urlWithQuery = '/products?category=books&page=2';
    const localizedUrl = '/en/products?category=books&page=2';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={urlWithQuery}>Products</LocalizedLink>);

    const link = screen.getByText('Products');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(urlWithQuery, mockLocale);
  });

  it('should handle URL with hash fragment', () => {
    const mockLocale = 'en-US';
    const urlWithHash = '/about#team';
    const localizedUrl = '/en/about#team';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={urlWithHash}>Team</LocalizedLink>);

    const link = screen.getByText('Team');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(urlWithHash, mockLocale);
  });

  it('should handle complex URL with query and hash', () => {
    const mockLocale = 'en-US';
    const complexUrl = '/products?category=electronics#reviews';
    const localizedUrl = '/en/products?category=electronics#reviews';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={complexUrl}>Product Reviews</LocalizedLink>);

    const link = screen.getByText('Product Reviews');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(complexUrl, mockLocale);
  });

  it('should re-render when locale changes and update the URL', () => {
    const initialLocale = 'en-US';
    const updatedLocale = 'es-ES';
    const internalUrl = '/about';
    const enLocalizedUrl = '/en/about';
    const esLocalizedUrl = '/es/about';

    mockUseLocale
      .mockReturnValueOnce({ locale: initialLocale })
      .mockReturnValueOnce({ locale: updatedLocale });

    mockGetLocalizedUrl
      .mockReturnValueOnce(enLocalizedUrl)
      .mockReturnValueOnce(esLocalizedUrl);

    const { rerender } = render(
      <LocalizedLink to={internalUrl}>About</LocalizedLink>
    );

    let link = screen.getByText('About');
    expect(link).toHaveAttribute('href', enLocalizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
      internalUrl,
      initialLocale
    );

    rerender(<LocalizedLink to={internalUrl}>About</LocalizedLink>);

    link = screen.getByText('About');
    expect(link).toHaveAttribute('href', esLocalizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(
      internalUrl,
      updatedLocale
    );
  });

  it('should handle relative URLs correctly', () => {
    const mockLocale = 'en-US';
    const relativeUrl = 'relative/path';
    const localizedUrl = '/en/relative/path';

    mockUseLocale.mockReturnValue({ locale: mockLocale });
    mockGetLocalizedUrl.mockReturnValue(localizedUrl);

    render(<LocalizedLink to={relativeUrl}>Relative Link</LocalizedLink>);

    const link = screen.getByText('Relative Link');
    expect(link).toHaveAttribute('href', localizedUrl);
    expect(mockGetLocalizedUrl).toHaveBeenCalledWith(relativeUrl, mockLocale);
  });
});
