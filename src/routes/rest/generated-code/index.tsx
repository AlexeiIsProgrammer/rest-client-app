import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import type { GeneratedCodeProps } from './types';
import { generateCode } from '~/utils/codeGenerators';
import { LANGUAGE_OPTIONS, LANGUAGES } from '~/constants';
import { useIntlayer } from 'react-intlayer';

const GeneratedCode = ({ method, url, body, headers }: GeneratedCodeProps) => {
  const content = useIntlayer('generated-code');

  const [language, setLanguage] = useState(LANGUAGES.curl);
  const [code, setCode] = useState<string>(LANGUAGES.curl);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const generated = generateCode(method, url, body, headers, language);
    setCode(generated);
  }, [method, url, body, headers, language]);

  return (
    <Box py={3}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{content.language}</InputLabel>
        <Select
          data-testid="select"
          value={language}
          label={content.language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={2}>
        {isClient ? (
          <SyntaxHighlighter
            language={
              language.includes('javascript') || language === LANGUAGES.nodejs
                ? 'javascript'
                : language
            }
            style={atomDark}
            showLineNumbers
            customStyle={{ margin: 0, borderRadius: '4px' }}
          >
            {code || content.select?.value}
          </SyntaxHighlighter>
        ) : (
          <Box
            component="pre"
            sx={{
              margin: 0,
              borderRadius: '4px',
              padding: 2,
              backgroundColor: '#1d1f21',
              color: '#c5c8c6',
              fontFamily:
                'Inconsolata, Monaco, Consolas, "Courier New", Courier, monospace',
              fontSize: '14px',
              lineHeight: 1.5,
              overflow: 'auto',
            }}
          >
            <code>{code || content.select?.value}</code>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GeneratedCode;
