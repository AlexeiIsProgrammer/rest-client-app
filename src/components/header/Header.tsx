import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { logout } from '../../firebase';
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
import RSSLogo from '../../assets/images/rss-logo.svg';
import LanguageSwitcher from '../LanguageSwitcher';
import { useIntlayer } from 'react-intlayer';

function Header(): React.ReactElement {
  const content = useIntlayer('header');

  const navigate = useNavigate();
  const isScrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

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
          aria-label={content.home?.value}
          sx={{ p: 0.5, borderRadius: 1 }}
        >
          <Box
            component="img"
            src={RSSLogo}
            alt={content.logo?.value}
            sx={{ height: 32, display: 'block' }}
          />
        </ButtonBase>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher />
        </Box>

        <Box sx={{ '& button': { m: 1 } }}>
          <Button startIcon={<Login />} variant="outlined" size="medium">
            {content['sign-in']}
          </Button>
          <Button startIcon={<PersonAdd />} variant="outlined" size="medium">
            {content['sign-up']}
          </Button>
          <Button
            startIcon={<Logout />}
            variant="outlined"
            size="medium"
            onClick={handleLogout}
          >
            {content.logout}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
