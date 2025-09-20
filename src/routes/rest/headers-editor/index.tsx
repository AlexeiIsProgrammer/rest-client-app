import {
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import type { HeadersEditorProps } from './types';
import type { Header } from '~/types';
import { useIntlayer } from 'react-intlayer';

const HeadersEditor = ({ headers, setHeaders }: HeadersEditorProps) => {
  const content = useIntlayer('headers-editor');

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
        {content.request}
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
              placeholder={content.name?.value}
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
              placeholder={content.value?.value}
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
            <IconButton title="Delete" onClick={() => removeHeader(index)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button startIcon={<Add />} onClick={addHeader}>
        {content.add}
      </Button>
    </Box>
  );
};

export default HeadersEditor;
