import {
  AppBar,
  Toolbar,
  ButtonBase,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import RSSLogo from '../../assets/images/rss-logo.svg';
import React from 'react';

function Footer(): React.ReactElement {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 'auto',
        bottom: 0,
        backgroundColor: '#E0E2E6',
        transition: 'all 0.3s ease-in-out',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '99vw',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '64px',
          transition: 'min-height 0.3s ease-in-out',
        }}
      >
        <IconButton
          component="a"
          href="https://github.com/AlexeiIsProgrammer/rest-client-app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Go to GitHub repository"
          color="inherit"
        >
          <GitHub fontSize="large" sx={{ color: 'black' }} />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          © 2025
        </Typography>
        <ButtonBase
          component="a"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Go to RS School React course"
          sx={{ p: 0.5, borderRadius: 1 }}
        >
          <Box
            component="img"
            src={RSSLogo}
            alt="RS School React Course Logo"
            sx={{ height: 32, display: 'block' }}
          />
        </ButtonBase>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
