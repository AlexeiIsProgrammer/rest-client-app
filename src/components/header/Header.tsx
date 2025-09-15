import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { logout, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
import { useLocalizedNavigate } from '~/hooks/useLocalizedNavigate';
import LanguageSwitcher from '../LanguageSwitcher';
import { useIntlayer } from 'react-intlayer';

function Header(): React.ReactElement {
  const [user, setUser] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const content = useIntlayer('header');

  const navigate = useLocalizedNavigate();
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

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
          aria-label={content.home?.value}
          sx={{ p: 0.5, borderRadius: 1 }}
        >
          <Box
            component="img"
            src={students}
            alt={content.logo?.value}
            sx={{ height: 42, display: 'block' }}
          />
        </ButtonBase>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher />
        </Box>

        <Box sx={{ '& > *': { m: 1 } }}>
          {!loading && user && user.email ? (
            <Button
              startIcon={<Logout />}
              variant="outlined"
              size="medium"
              onClick={() => {
                handleLogout();
              }}
            >
              {content.logout}
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
                {content['sign-in']}
              </Button>
              <Button
                startIcon={<PersonAdd />}
                component={Link}
                to="/signup"
                variant="outlined"
                size="medium"
              >
                {content['sign-up']}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
