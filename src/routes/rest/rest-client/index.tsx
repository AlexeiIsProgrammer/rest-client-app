import { useMemo, useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  Alert,
  styled,
} from '@mui/material';
import type { RESTClientProps } from './types';
import MethodSelector from '../method-selector';
import HeadersEditor from '../headers-editor';
import RequestBodyEditor from '../request-body-editor';
import EndpointInput from '../endpoint-input';
import GeneratedCode from '../generated-code';
import ResponseSection from '../response-section';
import { type Header } from '~/types';
import { METHODS } from '~/constants';
import { useNavigate } from 'react-router';
import validateUrl from '~/utils/validateUrl';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const RESTClient = ({
  initialMethod = METHODS.GET,
  initialUrl = '',
  initialBody = '',
  initialHeaders = [],
  response,
}: RESTClientProps) => {
  const [method, setMethod] = useState<METHODS>(initialMethod);
  const [url, setUrl] = useState<string>(initialUrl);
  const [requestBody, setRequestBody] = useState<string>(initialBody);
  const [headers, setHeaders] = useState<Header[]>(initialHeaders);
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  const error = useMemo(() => validateUrl(url), [url]);

  const updateURL = () => {
    if (error) return;

    const encodedUrl = btoa(url);
    const encodedBody = requestBody ? btoa(JSON.stringify(requestBody)) : '';

    const queryParams = new URLSearchParams();
    headers.forEach(({ name, value }) => {
      if (name && value) {
        queryParams.append(name, encodeURIComponent(value));
      }
    });

    const queryString = queryParams.toString();
    const newPath = `/rest/${method}/${encodedUrl}${encodedBody ? `/${encodedBody}` : ''}${queryString ? `?${queryString}` : ''}`;

    navigate(newPath, { replace: true });
  };

  const handleSendRequest = async () => {
    if (error) return;

    updateURL();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <StyledPaper>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid>
            <MethodSelector method={method} setMethod={setMethod} />
          </Grid>
          <Grid>
            <EndpointInput url={url} setUrl={setUrl} />
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSendRequest}
              disabled={!!error}
              size="large"
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Body" />
          <Tab label="Headers" />
          <Tab label="Code" />
        </Tabs>

        <Box hidden={activeTab !== 0} sx={{ pt: 2 }}>
          <RequestBodyEditor
            body={requestBody}
            setBody={setRequestBody}
            method={method}
          />
        </Box>

        <Box hidden={activeTab !== 1} sx={{ pt: 2 }}>
          <HeadersEditor headers={headers} setHeaders={setHeaders} />
        </Box>

        <Box hidden={activeTab !== 2} sx={{ pt: 2 }}>
          <GeneratedCode
            method={method}
            url={url}
            body={requestBody}
            headers={headers}
          />
        </Box>
      </StyledPaper>

      {response && <ResponseSection response={response} />}
    </Container>
  );
};

export default RESTClient;
