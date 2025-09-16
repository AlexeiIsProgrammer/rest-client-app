import { useEffect, useState, useCallback } from 'react';
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
import type { User } from 'firebase/auth';
import MethodSelector from '../method-selector';
import HeadersEditor from '../headers-editor';
import RequestBodyEditor from '../request-body-editor';
import EndpointInput from '../endpoint-input';
import GeneratedCode from '../generated-code';
import ResponseSection from '../response-section';
import { type Header, type RESTResponse } from '~/types';
import { METHODS } from '~/constants';
import validateUrl from '~/utils/validateUrl';
import { auth } from '~/firebase';
import saveHistory from '~/utils/saveHistory';
import toBase64 from '~/utils/toBase64';
import { useIntlayer } from 'react-intlayer';
import { useLocalizedNavigate } from '~/hooks/useLocalizedNavigate';
import { useVariablesContext } from '~/context/VariablesContext';
import { substituteVariables } from '~/utils/variableStorage';

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
  asyncHandleSendRequest,
}: RESTClientProps) => {
  const content = useIntlayer('rest-client');

  const [method, setMethod] = useState<METHODS>(initialMethod);
  const [url, setUrl] = useState<string>(initialUrl);
  const [requestBody, setRequestBody] = useState<string>(initialBody);
  const [headers, setHeaders] = useState<Header[]>(initialHeaders);
  const [activeTab, setActiveTab] = useState(0);
  const [path, setPath] = useState<string>('');

  const navigate = useLocalizedNavigate();
  const { variables } = useVariablesContext();

  const [error, setError] = useState('');

  const updateURL = () => {
    const substitutedUrl = substituteVariables(url, variables);
    const encodedUrl = toBase64(substitutedUrl);
    const encodedBody = requestBody
      ? toBase64(JSON.stringify(requestBody))
      : '';
    const encodedVariables = toBase64(JSON.stringify(variables));

    const queryParams = new URLSearchParams();
    headers.forEach(({ name, value }) => {
      if (name && value) {
        queryParams.append(name, encodeURIComponent(value));
      }
    });

    const queryString = queryParams.toString();
    const newPath = `/rest/${method}/${encodedUrl}${encodedBody ? `/${encodedBody}` : ''}${encodedVariables ? `/${encodedVariables}` : ''}${queryString ? `?${queryString}` : ''}`;

    navigate(newPath, { replace: true });
    setPath(newPath);
  };

  const handleSendRequest = async () => {
    const error = validateUrl(url, variables);
    if (error) {
      setError(error);
      return;
    }

    const substitutedUrl = substituteVariables(url, variables);
    const substitutedBody = substituteVariables(requestBody, variables);
    const substitutedHeaders = headers.map((header) => ({
      ...header,
      name: substituteVariables(header.name, variables),
      value: substituteVariables(header.value, variables),
    }));

    asyncHandleSendRequest({
      method,
      url: substitutedUrl,
      body: substitutedBody,
      headers: substitutedHeaders,
    });
    updateURL();
  };

  const saveResponseHistory = useCallback(
    (response: RESTResponse, user: User) => {
      const substitutedUrl = substituteVariables(url, variables);

      saveHistory({
        user,
        url: substitutedUrl,
        method,
        response,
        requestBody,
        path,
      });
    },
    [url, method, requestBody, path, variables]
  );

  useEffect(() => {
    if (!url) return;

    setError(validateUrl(url, variables));
  }, [url, variables]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && response) {
      saveResponseHistory(response, user);
    }
  }, [response, saveResponseHistory]);

  return (
    <Container maxWidth="lg" sx={{ mt: 3, pb: 10 }}>
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
              {content.send}
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
