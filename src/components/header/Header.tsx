import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { logout } from '../../firebase';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  ButtonBase,
  useScrollTrigger,
} from '@mui/material';
import { Login, Logout, PersonAdd } from '@mui/icons-material';
import RSSLogo from '../../assets/images/rss-logo.svg';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

function Header(): React.ReactElement {
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  const [user] = useAuthState(auth);

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
          component={RouterLink}
          to="/"
          aria-label="Go to home"
          sx={{ p: 0.5, borderRadius: 1 }}
        >
          <Box
            component="img"
            src={RSSLogo}
            alt="Logo"
            sx={{ height: 32, display: 'block' }}
          />
        </ButtonBase>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" size="medium">
            Lang Toggle
          </Button>
        </Box>

        <Box sx={{ '& > *': { m: 1 } }}>
          {user && user.email ? (
            <Button
              startIcon={<Logout />}
              variant="outlined"
              size="medium"
              onClick={() => logout()}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/signin"
                startIcon={<Login />}
                variant="outlined"
                size="medium"
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                startIcon={<PersonAdd />}
                variant="outlined"
                size="medium"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
