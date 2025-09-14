import React from 'react';
import { TextField } from '@mui/material';
import type { EndpointInputProps } from './types';
import { useIntlayer } from 'react-intlayer';

const EndpointInput = ({ url, setUrl }: EndpointInputProps) => {
  const content = useIntlayer('enpoint-input');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={content.label}
      placeholder="https://api.example.com/endpoint"
      value={url}
      onChange={handleUrlChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: 0,
        },
      }}
    />
  );
};

export default EndpointInput;
