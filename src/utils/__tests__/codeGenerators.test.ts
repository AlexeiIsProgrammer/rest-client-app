import { describe, it, expect } from 'vitest';
import { generateCode } from '../codeGenerators';
import { LANGUAGES, METHODS } from '~/constants';
import type { Header } from '~/types';

describe('Code Generators', () => {
  const mockUrl = 'https://api.example.com/users';
  const mockBody = '{"name": "John", "age": 30}';
  const mockHeaders: Header[] = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Authorization', value: 'Bearer token123' },
  ];

  describe('generateCode', () => {
    it('should generate curl code for LANGUAGES.curl', () => {
      const result = generateCode(
        METHODS.GET,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.curl
      );

      expect(result).toContain('curl -X GET');
      expect(result).toContain(mockUrl);
      expect(result).toContain('Content-Type: application/json');
      expect(result).toContain('Authorization: Bearer token123');
    });

    it('should generate JavaScript fetch code for LANGUAGES.javascript-fetch', () => {
      const result = generateCode(
        METHODS.POST,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES['javascript-fetch']
      );

      expect(result).toContain('fetch(');
      expect(result).toContain('method: "POST"');
      expect(result).toContain('Content-Type');
      expect(result).toContain('application/json');
      expect(result).toContain('.then(response => response.json())');
    });

    it('should generate JavaScript XHR code for LANGUAGES.javascript-xhr', () => {
      const result = generateCode(
        METHODS.PUT,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES['javascript-xhr']
      );

      expect(result).toContain('XMLHttpRequest');
      expect(result).toContain('xhr.open("PUT"');
      expect(result).toContain('setRequestHeader');
    });

    it('should generate Node.js code for LANGUAGES.nodejs', () => {
      const result = generateCode(
        METHODS.DELETE,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.nodejs
      );

      expect(result).toContain('require(');
      expect(result).toContain('http');
      expect(result).toContain('https');
      expect(result).toContain('hostname');
    });

    it('should generate Python code for LANGUAGES.python', () => {
      const result = generateCode(
        METHODS.PATCH,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.python
      );

      expect(result).toContain('import requests');
      expect(result).toContain('requests.patch');
      expect(result).toContain('headers');
    });

    it('should generate Java code for LANGUAGES.java', () => {
      const result = generateCode(
        METHODS.GET,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.java
      );

      expect(result).toContain('import java.net.HttpURLConnection');
      expect(result).toContain('HttpURLConnection');
      expect(result).toContain('setRequestMethod');
    });

    it('should generate C# code for LANGUAGES.csharp', () => {
      const result = generateCode(
        METHODS.POST,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.csharp
      );

      expect(result).toContain('using System.Net');
      expect(result).toContain('HttpWebRequest');
      expect(result).toContain('WebRequest.Create');
    });

    it('should generate Go code for LANGUAGES.go', () => {
      const result = generateCode(
        METHODS.PUT,
        mockUrl,
        mockBody,
        mockHeaders,
        LANGUAGES.go
      );

      expect(result).toContain('package main');
      expect(result).toContain('import (');
      expect(result).toContain('http.NewRequest');
    });

    it('should return not implemented message for unknown language', () => {
      const result = generateCode(
        METHODS.GET,
        mockUrl,
        mockBody,
        mockHeaders,
        'unknown' as LANGUAGES
      );

      expect(result).toContain('not implemented yet');
    });

    it('should handle empty url', () => {
      const result = generateCode(
        METHODS.GET,
        '',
        mockBody,
        mockHeaders,
        LANGUAGES.curl
      );

      expect(result).toContain('curl -X GET ""');
    });

    it('should handle empty headers', () => {
      const result = generateCode(
        METHODS.GET,
        mockUrl,
        mockBody,
        [],
        LANGUAGES.curl
      );

      expect(result).not.toContain('-H');
    });

    it('should handle empty body for methods that dont require it', () => {
      const result = generateCode(
        METHODS.GET,
        mockUrl,
        '',
        mockHeaders,
        LANGUAGES.curl
      );

      expect(result).not.toContain('-d');
    });
  });

  describe('Language-specific generators', () => {
    describe('generateCurlCode', () => {
      it('should include body for POST/PUT/PATCH/DELETE methods', () => {
        const methodsWithBody = [
          METHODS.POST,
          METHODS.PUT,
          METHODS.PATCH,
          METHODS.DELETE,
        ];

        methodsWithBody.forEach((method) => {
          const result = generateCode(
            method,
            mockUrl,
            mockBody,
            mockHeaders,
            LANGUAGES.curl
          );

          expect(result).toContain('-d');
          expect(result).toContain(mockBody);
        });
      });

      it('should not include body for GET/HEAD/OPTIONS methods', () => {
        const methodsWithoutBody = [METHODS.GET, METHODS.HEAD, METHODS.OPTIONS];

        methodsWithoutBody.forEach((method) => {
          const result = generateCode(
            method,
            mockUrl,
            mockBody,
            mockHeaders,
            LANGUAGES.curl
          );

          expect(result).not.toContain('-d');
        });
      });
    });

    describe('generateJavascriptFetchCode', () => {
      it('should handle JSON body parsing', () => {
        const result = generateCode(
          METHODS.POST,
          mockUrl,
          mockBody,
          mockHeaders,
          LANGUAGES['javascript-fetch']
        );

        expect(result).toContain('JSON.stringify');
      });

      it('should handle non-JSON body as template literal', () => {
        const nonJsonBody = 'plain text body';
        const result = generateCode(
          METHODS.POST,
          mockUrl,
          nonJsonBody,
          mockHeaders,
          LANGUAGES['javascript-fetch']
        );

        expect(result).toContain('`plain text body`');
        expect(result).not.toContain('JSON.stringify');
      });
    });

    describe('generateNodeJSCode', () => {
      it('should use https for https URLs', () => {
        const httpsUrl = 'https://api.example.com/users';
        const result = generateCode(
          METHODS.GET,
          httpsUrl,
          '',
          mockHeaders,
          LANGUAGES.nodejs
        );

        expect(result).toContain("require('https')");
      });

      it('should use http for http URLs', () => {
        const httpUrl = 'http://api.example.com/users';
        const result = generateCode(
          METHODS.GET,
          httpUrl,
          '',
          mockHeaders,
          LANGUAGES.nodejs
        );

        expect(result).toContain("require('http')");
      });
    });

    describe('generatePythonCode', () => {
      it('should use json parameter for JSON bodies', () => {
        const result = generateCode(
          METHODS.POST,
          mockUrl,
          mockBody,
          mockHeaders,
          LANGUAGES.python
        );

        expect(result).toContain('json=data');
      });

      it('should handle non-JSON bodies appropriately', () => {
        const nonJsonBody = 'plain text';
        const result = generateCode(
          METHODS.POST,
          mockUrl,
          nonJsonBody,
          mockHeaders,
          LANGUAGES.python
        );

        expect(result).toContain('"""plain text"""');
      });
    });

    describe('Error handling', () => {
      it('should handle invalid JSON bodies gracefully', () => {
        const invalidJson = '{invalid: json';

        expect(() => {
          generateCode(
            METHODS.POST,
            mockUrl,
            invalidJson,
            mockHeaders,
            LANGUAGES['javascript-fetch']
          );
        }).not.toThrow();
      });
    });
  });
});
