import {
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import type { HeadersEditorProps } from './types';
import type { Header } from '~/types';

const HeadersEditor = ({ headers, setHeaders }: HeadersEditorProps) => {
  const addHeader = () => {
    setHeaders([...headers, { name: '', value: '' }]);
  };

  const updateHeader = (index: number, name: keyof Header, value: string) => {
    setHeaders(
      headers.map((header, headerIndex) =>
        headerIndex === index ? { ...header, [name]: value } : header
      )
    );
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, ind) => ind !== index));
  };

  return (
    <Box py={3}>
      <Typography variant="h6" gutterBottom>
        Request Headers
      </Typography>

      {headers.map(({ name, value }, index) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          key={index}
          sx={{ mb: 2 }}
        >
          <Grid>
            <TextField
              fullWidth
              placeholder="Header name"
              name="name"
              value={name}
              onChange={(e) =>
                updateHeader(
                  index,
                  e.target.name as keyof Header,
                  e.target.value
                )
              }
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              placeholder="Header value"
              name="value"
              value={value}
              onChange={(e) =>
                updateHeader(
                  index,
                  e.target.name as keyof Header,
                  e.target.value
                )
              }
            />
          </Grid>
          <Grid>
            <IconButton onClick={() => removeHeader(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button startIcon={<Add />} onClick={addHeader}>
        Add Header
      </Button>
    </Box>
  );
};

export default HeadersEditor;
