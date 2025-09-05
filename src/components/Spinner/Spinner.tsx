import { Backdrop, CircularProgress } from '@mui/material';

function Spinner() {
  return (
    <Backdrop
      open
      sx={{
        color: '#1976d2',
        zIndex: 10,
        backdropFilter: 'blur(4px)',
      }}
    >
      <CircularProgress size={64} thickness={4} />
    </Backdrop>
  );
}

export default Spinner;
