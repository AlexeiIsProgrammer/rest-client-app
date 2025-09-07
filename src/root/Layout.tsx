import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { Box } from '@mui/material';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Box sx={{ pb: '64px' }}>{children}</Box>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default Layout;
