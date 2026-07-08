/**
 * Error with an HTTP status code attached. TanStack Start server functions
 * map `statusCode` onto the HTTP response, so middlewares throw this to
 * reject a request with a specific status (401, 403, 429, …).
 */
export class HttpError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
