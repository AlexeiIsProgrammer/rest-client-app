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
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';
import type { GeneratedCodeProps } from './types';
import { generateCode } from '~/utils/codeGenerators';
import { LANGUAGE_OPTIONS, LANGUAGES } from '~/constants';

const GeneratedCode = ({ method, url, body, headers }: GeneratedCodeProps) => {
  const [language, setLanguage] = useState(LANGUAGES.curl);
  const [code, setCode] = useState<string>(LANGUAGES.curl);

  useEffect(() => {
    const generated = generateCode(method, url, body, headers, language);
    setCode(generated);
  }, [method, url, body, headers, language]);

  return (
    <Box py={3}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          label="Language"
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
        {/* {code} */}
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
          {code || '// Select a language to generate code'}
        </SyntaxHighlighter>
      </Paper>
    </Box>
  );
};

export default GeneratedCode;
