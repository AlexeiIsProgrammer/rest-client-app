import React from 'react';
import { Link } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logout, auth } from '../../firebase';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  ButtonBase,
  useScrollTrigger,
} from '@mui/material';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import students from '../../assets/images/mentor-with-his-students.svg';

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
          component={Link}
          to="/"
          aria-label="Go to home"
          sx={{ p: 0.5, borderRadius: 1 }}
        >
          <Box
            component="img"
            src={students}
            alt="Logo"
            sx={{ height: 42, display: 'block' }}
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
                startIcon={<Login />}
                component={Link}
                to="/signin"
                variant="outlined"
                size="medium"
              >
                Sign In
              </Button>
              <Button
                startIcon={<PersonAdd />}
                component={Link}
                to="/signup"
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
