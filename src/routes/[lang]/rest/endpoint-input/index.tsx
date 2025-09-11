import React from 'react';
import { TextField } from '@mui/material';
import type { EndpointInputProps } from './types';

const EndpointInput = ({ url, setUrl }: EndpointInputProps) => {
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Endpoint URL"
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
