import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders the login button', () => {
    render(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders the sign up button', () => {
    render(<Header />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});