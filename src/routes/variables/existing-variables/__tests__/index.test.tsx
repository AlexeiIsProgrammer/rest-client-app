import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExistingVariables from '../ExistingVariables';
import { VariablesProvider } from '~/context/VariablesContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockAddVariable = vi.fn();
const mockUpdateVariable = vi.fn();
const mockDeleteVariable = vi.fn();

const createMockContextWithData = () => ({
  variables: [{ id: '1', name: 'test', value: 'value' }],
  addVariable: mockAddVariable,
  updateVariable: mockUpdateVariable,
  deleteVariable: mockDeleteVariable,
  loading: false,
});

const mockUseVariablesContext = vi.fn();

vi.mock('~/context/VariablesContext', () => ({
  useVariablesContext: () => mockUseVariablesContext(),
  VariablesProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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
    'variable-name': { value: 'Variable name' },
    'variable-value': { value: 'Variable value' },
    add: 'Add',
    edit: { value: 'Edit' },
    save: { value: 'Save' },
    cancel: { value: 'Cancel' },
    delete: { value: 'Delete' },
    required: { value: 'Name and value are required' },
    exists: { value: 'Variable with this name already exists' },
    added: { value: 'Variable added successfully' },
    update: { value: 'Variable updated successfully' },
    deleted: { value: 'deleted' },
    loading: 'Loading...',
  }),
}));

describe('ExistingVariables', () => {
  const renderComponent = () => {
    return render(
      <VariablesProvider>
        <ExistingVariables />
      </VariablesProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseVariablesContext.mockReturnValue({
      variables: [],
      addVariable: mockAddVariable,
      updateVariable: mockUpdateVariable,
      deleteVariable: mockDeleteVariable,
      loading: false,
    });
  });

  it('should render ExistingVariables with all basic elements', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /variables/i })
      ).toBeInTheDocument();
    });
  });

  it('should have table for variables', () => {
    renderComponent();

    expect(
      screen.getByRole('table', { name: /editable variables/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Variable name')).toBeInTheDocument();
  });

  it('should show loading state when loading is true', () => {
    mockUseVariablesContext.mockReturnValue({
      variables: [],
      addVariable: mockAddVariable,
      updateVariable: mockUpdateVariable,
      deleteVariable: mockDeleteVariable,
      loading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should call addVariable when valid data is provided', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(nameInput, 'newVar');
    await user.type(valueInput, 'newValue');
    await user.click(addButton);

    expect(mockAddVariable).toHaveBeenCalledWith('newVar', 'newValue');
  });

  it('should show error snackbar when adding duplicate variable name', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(nameInput, 'test');
    await user.type(valueInput, 'newValue');
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText('Variable with this name already exists')
      ).toBeInTheDocument();
    });
    expect(mockAddVariable).not.toHaveBeenCalled();
  });

  it('should clear form fields after successful add', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(nameInput, 'newVar');
    await user.type(valueInput, 'newValue');
    await user.click(addButton);

    expect(nameInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });

  it('should enter edit mode when edit button is clicked', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);
    expect(screen.getByTitle('Save')).toBeInTheDocument();
    expect(screen.getByTitle('Cancel')).toBeInTheDocument();

    const nameInputs = screen.getAllByDisplayValue('test');
    const valueInputs = screen.getAllByDisplayValue('value');
    expect(nameInputs).toHaveLength(1);
    expect(valueInputs).toHaveLength(1);
  });

  it('should save edit when valid data is provided', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('test');
    const valueInput = screen.getByDisplayValue('value');

    await user.clear(nameInput);
    await user.type(nameInput, 'updatedName');
    await user.clear(valueInput);
    await user.type(valueInput, 'updatedValue');

    const saveButton = screen.getByTitle('Save');
    await user.click(saveButton);

    expect(mockUpdateVariable).toHaveBeenCalledWith(
      '1',
      'updatedName',
      'updatedValue'
    );
  });

  it('should show error snackbar when saving with empty name', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('test');
    await user.clear(nameInput);

    const saveButton = screen.getByTitle('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name and value are required')
      ).toBeInTheDocument();
    });
    expect(mockUpdateVariable).not.toHaveBeenCalled();
  });

  it('should show error snackbar when saving with empty value', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    const valueInput = screen.getByDisplayValue('value');
    await user.clear(valueInput);

    const saveButton = screen.getByTitle('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('Name and value are required')
      ).toBeInTheDocument();
    });
    expect(mockUpdateVariable).not.toHaveBeenCalled();
  });

  it('should show error snackbar when saving with duplicate name', async () => {
    const mockContextWithMultipleVars = {
      variables: [
        { id: '1', name: 'test', value: 'value' },
        { id: '2', name: 'other', value: 'otherValue' },
      ],
      addVariable: mockAddVariable,
      updateVariable: mockUpdateVariable,
      deleteVariable: mockDeleteVariable,
      loading: false,
    };
    mockUseVariablesContext.mockReturnValue(mockContextWithMultipleVars);
    const user = userEvent.setup();

    renderComponent();

    const editButtons = screen.getAllByTitle('Edit');
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('test');
    await user.clear(nameInput);
    await user.type(nameInput, 'other'); // Duplicate name

    const saveButton = screen.getByTitle('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('Variable with this name already exists')
      ).toBeInTheDocument();
    });
    expect(mockUpdateVariable).not.toHaveBeenCalled();
  });

  it('should exit edit mode after successful save', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    const saveButton = screen.getByTitle('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTitle('Edit')).toBeInTheDocument();
      expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });
  });

  it('should cancel edit and exit edit mode', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    const cancelButton = screen.getByTitle('Cancel');
    await user.click(cancelButton);

    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('should delete variable when delete button is clicked', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByTitle('Delete');
    await user.click(deleteButton);

    expect(mockDeleteVariable).toHaveBeenCalledWith('1');
  });

  it('should show success snackbar after deleting variable', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByTitle('Delete');
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/test.*deleted/)).toBeInTheDocument();
    });
  });

  it('should trigger add variable on Enter key press in name input', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');

    await user.type(nameInput, 'newVar');
    await user.type(valueInput, 'newValue');
    await user.keyboard('{Enter}');

    expect(mockAddVariable).toHaveBeenCalledWith('newVar', 'newValue');
  });

  it('should trigger add variable on Enter key press in value input', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');

    await user.type(nameInput, 'newVar');
    await user.type(valueInput, 'newValue');
    await user.keyboard('{Enter}');

    expect(mockAddVariable).toHaveBeenCalledWith('newVar', 'newValue');
  });

  it('should trigger save edit on Enter key press in edit mode', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    await user.keyboard('{Enter}');

    expect(mockUpdateVariable).toHaveBeenCalledWith('1', 'test', 'value');
  });

  it('should trigger save edit on Enter key press in value input during edit', async () => {
    mockUseVariablesContext.mockReturnValue(createMockContextWithData());
    const user = userEvent.setup();

    renderComponent();

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    await user.keyboard('{Enter}');

    expect(mockUpdateVariable).toHaveBeenCalledWith('1', 'test', 'value');
  });

  it('should handle empty variables array', () => {
    renderComponent();

    expect(
      screen.getByText('No variables yet. Add your first variable below.')
    ).toBeInTheDocument();
  });

  it('should disable add button when inputs are empty', () => {
    renderComponent();

    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeDisabled();
  });

  it('should enable add button when both inputs have values', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(nameInput, 'test');
    await user.type(valueInput, 'value');

    expect(addButton).not.toBeDisabled();
  });
});
