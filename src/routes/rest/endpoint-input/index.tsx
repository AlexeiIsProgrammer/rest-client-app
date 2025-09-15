import React from 'react';
import { TextField, InputAdornment, Chip } from '@mui/material';
import Code from '@mui/icons-material/Code';
import type { EndpointInputProps } from './types';
import { useIntlayer } from 'react-intlayer';
import { countVariables } from '~/utils/variableHighlight';

const EndpointInput = ({ url, setUrl }: EndpointInputProps) => {
  const content = useIntlayer('enpoint-input');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const variableCount = countVariables(url);

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={content.label}
      placeholder="https://api.example.com/endpoint"
      value={url}
      onChange={handleUrlChange}
      slotProps={{
        input: {
          endAdornment: variableCount > 0 && (
            <InputAdornment position="end">
              <Chip
                icon={<Code />}
                label={`${variableCount} variable${variableCount > 1 ? 's' : ''}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: 0,
        },
        width: '100%',
        minWidth: '600px',
        '& .MuiInputBase-input': {
          fontSize: '16px',
          padding: '16px 14px',
        },
      }}
    />
  );
};

export default EndpointInput;
