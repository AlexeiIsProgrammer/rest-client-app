import { useState } from 'react';
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
// import { useNavigate } from 'react-router';
import MethodSelector from '../method-selector';
import { useRESTClient } from '~/hooks/useRESTClient';
import HeadersEditor from '../headers-editor';
import RequestBodyEditor from '../request-body-editor';
import EndpointInput from '../endpoint-input';
import GeneratedCode from '../generated-code';
import ResponseSection from '../response-section';
import { type Header } from '~/types';
import { METHODS } from '~/constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const RESTClient = ({
  initialMethod = METHODS.GET,
  initialUrl = '',
  initialBody = '',
  initialHeaders = [],
}: RESTClientProps) => {
  const [method, setMethod] = useState<METHODS>(initialMethod);
  const [url, setUrl] = useState<string>(initialUrl);
  const [requestBody, setRequestBody] = useState<string>(initialBody);
  const [headers, setHeaders] = useState<Header[]>(initialHeaders);
  const [activeTab, setActiveTab] = useState(0);
  const [urlError, setUrlError] = useState('');

  const { response, loading, sendRequest } = useRESTClient();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   updateURL();
  // }, [method, url, requestBody, headers]);

  const validateUrl = (url: string): string => {
    if (!url) return 'URL is required';
    try {
      new URL(url);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  // const updateURL = () => {
  //   const error = validateUrl(url);
  //   setUrlError(error);

  //   if (error) return;

  //   const encodedUrl = btoa(url);
  //   const encodedBody = requestBody ? btoa(JSON.stringify(requestBody)) : '';

  //   const queryParams = new URLSearchParams();
  //   headers.forEach(({ name, value }) => {
  //     if (name && value) {
  //       queryParams.append(name, encodeURIComponent(value));
  //     }
  //   });

  //   const queryString = queryParams.toString();
  //   const newPath = `/${method}/${encodedUrl}${encodedBody ? `/${encodedBody}` : ''}${queryString ? `?${queryString}` : ''}`;

  //   navigate(newPath, { replace: true });
  // };

  const handleSendRequest = async () => {
    const error = validateUrl(url);
    setUrlError(error);

    if (error) return;

    await sendRequest(method, url, requestBody, headers);
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
            {urlError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {urlError}
              </Alert>
            )}
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSendRequest}
              disabled={loading || !!urlError}
              size="large"
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
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
