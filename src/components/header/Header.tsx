import React from 'react';
import { logout } from '../../firebase';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Header(): React.ReactElement {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#E0E2E6' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Logo
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" size="medium">
            Lang Toggle
          </Button>
        </Box>

        <Box sx={{ '& button': { m: 1 } }}>
          <Button startIcon={<LoginIcon />} variant="outlined" size="medium">
            Sign In
          </Button>
          <Button
            startIcon={<PersonAddIcon />}
            variant="outlined"
            size="medium"
          >
            Sign Up
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            variant="outlined"
            size="medium"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
