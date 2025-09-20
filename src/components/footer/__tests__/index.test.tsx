import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Footer with all basic elements', () => {
    render(<Footer />);

    expect(screen.getByText('© 2025')).toBeInTheDocument();
    expect(
      screen.getByAltText('RS School React Course Logo')
    ).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: /RS School React Course/i })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/AlexeiIsProgrammer/rest-client-app'
    );
  });
});
