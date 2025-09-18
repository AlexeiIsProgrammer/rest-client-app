import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockVariables = [
  { id: '1', name: 'api_url', value: 'https://api.example.com' },
  { id: '2', name: 'token', value: 'abc123' },
];

const mockUseVariablesContext = {
  variables: [] as { id: string; name: string; value: string }[],
  addVariable: vi.fn(),
  updateVariable: vi.fn(),
  deleteVariable: vi.fn(),
  loading: false,
};

vi.mock('../../../context/VariablesContext', () => {
  return {
    useVariablesContext: () => mockUseVariablesContext,
  };
});

vi.mock('react-intlayer', () => ({
  useIntlayer: () => ({
    variables: 'Variables',
    format: 'Use variables in your requests with the format',
    examples: 'Examples',
    header: 'Header',
    variable: 'Variable',
    value: 'Value',
    actions: 'Actions',
    'no-variables': 'No variables yet. Add your first variable below.',
    'variable-name': 'Variable name',
    'variable-value': 'Variable value',
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    required: { value: 'Name and value are required' },
    exists: { value: 'Variable with this name already exists' },
    added: { value: 'Variable added successfully' },
    update: { value: 'Variable updated successfully' },
    deleted: { value: 'deleted' },
    loading: 'Loading...',
  }),
}));

import Variables, { meta } from '../index';
import VariablesLoading from '../Variables.lazy';

describe('Variables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseVariablesContext.variables = [];
    mockUseVariablesContext.loading = false;
  });

  it('should render Variables with all basic elements', () => {
    render(<Variables />);

    expect(
      screen.getByRole('heading', { name: /variables/i })
    ).toBeInTheDocument();
  });

  it('should have table for variables', () => {
    render(<Variables />);

    expect(
      screen.getByRole('table', { name: /editable variables/i })
    ).toBeInTheDocument();
  });

  it('should have input fields for adding variables', () => {
    render(<Variables />);

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(2);
  });

  it('should have Add button', () => {
    render(<Variables />);

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should show no variables message when variables array is empty', () => {
    render(<Variables />);

    expect(
      screen.getByText('No variables yet. Add your first variable below.')
    ).toBeInTheDocument();
  });

  it('should display existing variables in table', () => {
    mockUseVariablesContext.variables = mockVariables;
    render(<Variables />);

    expect(screen.getByText('api_url')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
    expect(screen.getAllByText('token')).toHaveLength(2); // One in examples, one in table
    expect(screen.getByText('abc123')).toBeInTheDocument();
  });

  it('should show loading state when loading is true', () => {
    mockUseVariablesContext.loading = true;
    render(<Variables />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render Container with correct props', () => {
    render(<Variables />);

    const container = document.querySelector('.MuiContainer-root');
    expect(container).toBeInTheDocument();
  });

  it('should render ExistingVariables component', () => {
    render(<Variables />);

    expect(
      screen.getByRole('heading', { name: /variables/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('table', { name: /editable variables/i })
    ).toBeInTheDocument();
  });

  it('should return correct meta data', () => {
    const metaData = meta();

    expect(metaData).toEqual([
      { title: 'Variables page' },
      { name: 'description', content: 'Manage your REST API variables' },
    ]);
  });
});

describe('Lazy Variables', () => {
  it('should render VariablesLoading component with loading spinner', () => {
    render(<VariablesLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
