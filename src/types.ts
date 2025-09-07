export type RESTResponse = {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: string;
  error?: string;
  time?: number;
  duration?: number;
};

export type Header = {
  name: string;
  value: string;
};

export type RequestHeader = Record<string, string>;

export type RequestData = {
  method: string;
  url: string;
  body: string;
  headers: Record<string, string>;
};
