import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: isScrolled ? '#F5F5F5' : '#E0E2E6',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          minHeight: isScrolled ? '56px' : '64px',
          transition: 'min-height 0.3s ease-in-out',
        }}
      >
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
