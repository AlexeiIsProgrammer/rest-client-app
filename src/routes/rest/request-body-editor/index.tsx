import { TextField, Box, Typography } from '@mui/material';
import { JsonViewer } from '@textea/json-viewer';
import type { RequestBodyEditorProps } from './types';
import { METHODS } from '~/constants';

const RequestBodyEditor = ({
  body,
  setBody,
  method,
}: RequestBodyEditorProps) => {
  const hasBody = [METHODS.POST, METHODS.PUT, METHODS.PATCH].includes(method);

  // const parsedBody = useMemo(() => {
  //   try {
  // JSON.parse(body)
  //   } catch () {

  //   }
  // }, [body])

  if (!hasBody) {
    return (
      <Box py={3}>
        <Typography color="textSecondary">
          This HTTP method typically doesn&apos;t include a request body.
        </Typography>
      </Box>
    );
  }

  return (
    <Box py={3}>
      <TextField
        fullWidth
        multiline
        minRows={6}
        maxRows={12}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='{"key": "value"}'
        label="Request Body"
      />

      {body && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Parsed View:
          </Typography>
          <JsonViewer value={JSON.parse(body)} />
        </Box>
      )}
    </Box>
  );
};

export default RequestBodyEditor;
