import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  Button,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { Delete, Add, Edit, Save, Cancel } from '@mui/icons-material';
import { useVariablesContext } from '../../../context/VariablesContext';
import type { Variable } from '../types';

function ExistingVariables() {
  const { variables, addVariable, updateVariable, deleteVariable, loading } =
    useVariablesContext();
  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' = 'success'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddVariable = () => {
    if (!newVariableName.trim() || !newVariableValue.trim()) {
      showSnackbar('Both variable name and value are required', 'error');
      return;
    }

    const existingVariable = variables.find(
      (v) => v.name === newVariableName.trim()
    );
    if (existingVariable) {
      showSnackbar('Variable name already exists', 'error');
      return;
    }

    addVariable(newVariableName, newVariableValue);
    setNewVariableName('');
    setNewVariableValue('');
    showSnackbar('Variable added successfully');
  };

  const handleStartEdit = (variable: Variable) => {
    setEditingId(variable.id);
    setEditingName(variable.name);
    setEditingValue(variable.value);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim() || !editingValue.trim()) {
      showSnackbar('Both variable name and value are required', 'error');
      return;
    }

    const existingVariable = variables.find(
      (v) => v.name === editingName.trim() && v.id !== editingId
    );
    if (existingVariable) {
      showSnackbar('Variable name already exists', 'error');
      return;
    }

    if (editingId) {
      updateVariable(editingId, editingName, editingValue);
      setEditingId(null);
      setEditingName('');
      setEditingValue('');
      showSnackbar('Variable updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingValue('');
  };

  const handleDeleteVariable = (id: string, name: string) => {
    deleteVariable(id);
    showSnackbar(`Variable "${name}" deleted successfully`);
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      action();
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading variables...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 2,
        alignItems: 'start',
      }}
    >
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Variables
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use variables in your requests with the format: {'{'}
          {'{'}
          <em>variableName</em>
          {'}'}
          {'}'}
          <br />
          <strong>Examples:</strong>
          <br />• URL:{' '}
          <code>
            https://api.github.com/{'{'}
            {'{'}
            <em>username</em>
            {'}'}
            {'}'}{' '}
          </code>
          <br />• Header:{' '}
          <code>
            Authorization: Bearer {'{'}
            {'{'}
            <em>token</em>
            {'}'}
            {'}'}{' '}
          </code>
          <br />• JSON Body:{' '}
          <code>
            {'{'}&quot;name&quot;: &quot;{'{'}{'{'}
            <em>userName</em>
            {'}'}{'}'}&quot;{'}'}
          </code>
        </Typography>
        <Table size="small" aria-label="Editable variables">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%', fontWeight: 600 }}>
                Variable
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              <TableCell align="right" sx={{ width: 120, fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variables.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 6, color: 'text.secondary' }}
                >
                  No variables yet. Add your first variable below.
                </TableCell>
              </TableRow>
            )}
            {variables.map((variable) => (
              <TableRow key={variable.id}>
                <TableCell>
                  {editingId === variable.id ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
                      autoFocus
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {variable.name}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === variable.id ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: 'break-word',
                        maxWidth: '200px',
                      }}
                    >
                      {variable.value}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingId === variable.id ? (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleSaveEdit}
                        title="Save changes"
                      >
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleCancelEdit}
                        title="Cancel editing"
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleStartEdit(variable)}
                        title="Edit variable"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDeleteVariable(variable.id, variable.name)
                        }
                        title="Delete variable"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Variable name"
                  value={newVariableName}
                  onChange={(e) => setNewVariableName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddVariable)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Variable value"
                  value={newVariableValue}
                  onChange={(e) => setNewVariableValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddVariable)}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddVariable}
                  disabled={!newVariableName.trim() || !newVariableValue.trim()}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ExistingVariables;
