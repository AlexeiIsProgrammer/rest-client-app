import React from 'react';
import { Link } from 'react-router';
import { logout } from '../../firebase';
import { AppBar, Toolbar, Button, Box, ButtonBase, useScrollTrigger } from '@mui/material';
import { Login, Logout, PersonAdd } from '@mui/icons-material';
import RSSLogo from '../../assets/images/rss-logo.svg'

function Header(): React.ReactElement {
  const isScrolled = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  return (
    <AppBar
      position="sticky"
      elevation={isScrolled ? 2 : 0}
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
        <ButtonBase
            component={Link}
            to="/"
            aria-label="Go to home"
            sx={{ p: 0.5, borderRadius: 1 }}
          >
            <Box component="img" src={RSSLogo} alt="Your brand" sx={{ height: 32, display: "block" }} />
        </ButtonBase>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" size="medium">
            Lang Toggle
          </Button>
        </Box>

        <Box sx={{ '& button': { m: 1 } }}>
          <Button startIcon={<Login />} variant="outlined" size="medium">
            Sign In
          </Button>
          <Button
            startIcon={<PersonAdd />}
            variant="outlined"
            size="medium"
          >
            Sign Up
          </Button>
          <Button
            startIcon={<Logout />}
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
