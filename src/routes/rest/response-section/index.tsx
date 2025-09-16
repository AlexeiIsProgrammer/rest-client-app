import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import type { ResponseSectionProps } from './types';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import { useIntlayer } from 'react-intlayer';

const ResponseSection = ({ response }: ResponseSectionProps) => {
  const content = useIntlayer('response-section');

  const [activeTab, setActiveTab] = useState(0);
  const [expandedHeaders, setExpandedHeaders] = useState(false);

  if (!response) return null;

  const isError = response.error || (response.status && response.status >= 400);
  const responseTime =
    response.time && response.duration ? ` (${response.duration} ms)` : '';

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        {isError ? (
          <Cancel color="error" sx={{ mr: 1 }} />
        ) : (
          <CheckCircle color="success" sx={{ mr: 1 }} />
        )}
        <Typography variant="h6" component="h2">
          {content.response}{' '}
          {response.status && `- ${response.status} ${response.statusText}`}
          {responseTime}
        </Typography>
        {response.status && Boolean(response.status) && (
          <Chip
            label={response.status}
            color={response.status < 400 ? 'success' : 'error'}
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <Tab label="Body" />
        <Tab label="Headers" />
        <Tab label="Raw" />
      </Tabs>

      <Box mt={2}>
        {activeTab === 0 && (
          <Box>
            {response.data ? (
              <SyntaxHighlighter
                language="json"
                style={atomDark}
                showLineNumbers
                customStyle={{
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflow: 'auto',
                }}
              >
                {typeof response.data === 'string'
                  ? response.data
                  : JSON.stringify(response.data, null, 2)}
              </SyntaxHighlighter>
            ) : (
              <Typography color="textSecondary">
                {content['no-response']}
              </Typography>
            )}
          </Box>
        )}

        {activeTab === 1 && response.headers && (
          <Box>
            <Box
              display="flex"
              alignItems="center"
              onClick={() => setExpandedHeaders(!expandedHeaders)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1">
                {content.headers} ({Object.keys(response.headers).length})
              </Typography>
              <IconButton size="small">
                {expandedHeaders ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expandedHeaders}>
              <List dense>
                {Object.entries(response.headers).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText primary={key} secondary={value} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                backgroundColor: '#1a1a1a',
                padding: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '400px',
                fontFamily: 'monospace',
                color: '#f8f8f2',
              }}
            >
              {JSON.stringify(response, null, 2)}
            </Typography>
          </Box>
        )}
      </Box>

      {response.error && (
        <Box mt={2} p={2} bgcolor="error.light" borderRadius={1}>
          <Typography variant="body2" color="error.contrastText">
            <strong>{content.error}:</strong> {response.error}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ResponseSection;
