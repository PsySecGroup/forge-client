declare module 'follow-redirects' {
  import { RequestOptions, ClientRequest, IncomingMessage } from 'http';

  type Callback = (res: IncomingMessage) => void;

  type GetFunction = (
    url: string | URL,
    optionsOrCallback?: RequestOptions | Callback,
    callback?: Callback
  ) => ClientRequest;

  type RequestFunction = (
    url: string | URL,
    options?: RequestOptions,
    callback?: Callback
  ) => ClientRequest;

  export const http: {
    get: GetFunction;
    request: RequestFunction;
  };

  export const https: {
    get: GetFunction;
    request: RequestFunction;
  };
}
