import { TextField, Box, Typography, Button } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import type { RequestBodyEditorProps } from './types';
import { METHODS } from '~/constants';
import { useEffect, useState } from 'react';
import { useIntlayer } from 'react-intlayer';

const RequestBodyEditor = ({
  body,
  setBody,
  method,
}: RequestBodyEditorProps) => {
  const content = useIntlayer('request-body-editor');
  const hasBody = [METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(method);

  const [parsedBody, setParsedBody] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const prettifyHandle = () => {
    if (!body || error) return;

    const parsed = JSON.parse(body);
    const prettyfied = JSON.stringify(parsed, null, 2);
    setBody(prettyfied);
  };

  useEffect(() => {
    setError(false);

    if (!body) return;

    try {
      const parsed = JSON.parse(body);

      setParsedBody(parsed);
    } catch {
      setError(true);
    }
  }, [body]);

  if (!hasBody) {
    return (
      <Box py={3}>
        <Typography color="textSecondary">{content['no-body']}</Typography>
      </Box>
    );
  }

  return (
    <Box py={3}>
      <Button
        type="button"
        variant="contained"
        color="primary"
        fullWidth
        onClick={prettifyHandle}
        sx={{ mb: 2 }}
      >
        {content.prettify}
      </Button>
      <TextField
        error={error}
        fullWidth
        multiline
        minRows={6}
        maxRows={12}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='{"key": "value"}'
        label={error ? content.invalid : content.body}
      />

      {body && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            {content['parsed-view']}
          </Typography>
          <JsonViewer value={parsedBody} />
        </Box>
      )}
    </Box>
  );
};

export default RequestBodyEditor;
