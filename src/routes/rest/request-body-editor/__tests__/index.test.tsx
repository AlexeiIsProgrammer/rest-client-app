import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RequestBodyEditor from '..';
import { METHODS } from '~/constants';

vi.mock('@textea/json-viewer', () => ({
  JsonViewer: ({ value }: { value }) => (
    <div data-testid="json-viewer">{JSON.stringify(value)}</div>
  ),
}));

describe('RequestBodyEditor', () => {
  const mockSetBody = vi.fn();
  const validJson = '{"name": "John", "age": 30}';
  const invalidJson = '{name: "John"}';
  const prettifiedJson = `{
  "name": "John",
  "age": 30
}`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Methods without body', () => {
    const noBodyMethods = [
      METHODS.GET,
      METHODS.DELETE,
      METHODS.HEAD,
      METHODS.OPTIONS,
    ];

    noBodyMethods.forEach((method) => {
      it(`shows no-body message for ${method} method`, () => {
        render(
          <RequestBodyEditor body="" setBody={mockSetBody} method={method} />
        );

        expect(
          screen.getByText(
            "This HTTP method typically doesn't include a request body."
          )
        ).toBeInTheDocument();
        expect(screen.queryByText('Prettify')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Request Body')).not.toBeInTheDocument();
      });
    });
  });

  describe('Methods with body', () => {
    const bodyMethods = [METHODS.POST, METHODS.PUT, METHODS.PATCH];

    bodyMethods.forEach((method) => {
      it(`renders body editor for ${method} method`, () => {
        render(
          <RequestBodyEditor body="" setBody={mockSetBody} method={method} />
        );

        expect(screen.getByText('Prettify')).toBeInTheDocument();
        expect(screen.getByLabelText('Request Body')).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText('{"key": "value"}')
        ).toBeInTheDocument();
      });

      it('calls setBody when text is entered', () => {
        render(
          <RequestBodyEditor body="" setBody={mockSetBody} method={method} />
        );

        const textarea = screen.getByLabelText('Request Body');
        fireEvent.change(textarea, { target: { value: validJson } });

        expect(mockSetBody).toHaveBeenCalledWith(validJson);
      });

      it('shows error for invalid JSON', () => {
        render(
          <RequestBodyEditor
            body={invalidJson}
            setBody={mockSetBody}
            method={method}
          />
        );

        screen.getAllByText('Invalid JSON').forEach((el) => {
          expect(el).toBeInTheDocument();
        });
      });

      it('prettifies JSON when button is clicked', () => {
        render(
          <RequestBodyEditor
            body={validJson}
            setBody={mockSetBody}
            method={method}
          />
        );

        const prettifyButton = screen.getByText('Prettify');
        fireEvent.click(prettifyButton);

        expect(mockSetBody).toHaveBeenCalledWith(prettifiedJson);
      });

      it('does not prettify invalid JSON', () => {
        render(
          <RequestBodyEditor
            body={invalidJson}
            setBody={mockSetBody}
            method={method}
          />
        );

        const prettifyButton = screen.getByText('Prettify');
        fireEvent.click(prettifyButton);

        expect(mockSetBody).not.toHaveBeenCalled();
      });

      it('shows parsed view for valid JSON', async () => {
        render(
          <RequestBodyEditor
            body={validJson}
            setBody={mockSetBody}
            method={method}
          />
        );

        expect(screen.getByText(/Parsed View/i)).toBeInTheDocument();
      });

      it('show parsed view for invalid JSON', () => {
        render(
          <RequestBodyEditor
            body={invalidJson}
            setBody={mockSetBody}
            method={method}
          />
        );

        expect(screen.queryByText(/Parsed View/i)).toBeInTheDocument();
      });

      it('does not show parsed view for empty body', () => {
        render(
          <RequestBodyEditor body="" setBody={mockSetBody} method={method} />
        );

        expect(screen.queryByText(/Parsed View/i)).not.toBeInTheDocument();
      });
    });
  });
});
