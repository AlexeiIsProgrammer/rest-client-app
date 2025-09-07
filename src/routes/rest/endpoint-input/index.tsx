import React from 'react';
import { TextField } from '@mui/material';

interface EndpointInputProps {
  url: string;
  setUrl: (url: string) => void;
}

const EndpointInput: React.FC<EndpointInputProps> = ({ url, setUrl }) => {
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
