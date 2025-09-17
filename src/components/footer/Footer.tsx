import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography } from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import RSSIcon from '../../assets/images/rss-logo.svg';

function Footer(): React.ReactElement {
  return (
    <AppBar
      position="fixed"
      sx={{
        top: 'auto',
        bottom: 0,
        backgroundColor: '#E0E2E6',
        boxShadow: 'none',
        transition: 'all 0.3s ease-in-out',
        margin: '0 8px',
        width: 'calc(100% - 16px)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          minHeight: 56,
          paddingX: 2,
        }}
      >
        <IconButton
          component="a"
          href="https://github.com/AlexeiIsProgrammer/rest-client-app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Author GitHub"
        >
          <GitHub sx={{ color: 'black' }} />
        </IconButton>

        <Typography variant="body2" color="textSecondary">
          © 2025
        </Typography>

        <IconButton
          component="a"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RS School React Course"
          sx={{ p: 0 }}
        >
          <Box
            component="img"
            src={RSSIcon}
            alt="RS School React Course Logo"
            sx={{ height: 32 }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
