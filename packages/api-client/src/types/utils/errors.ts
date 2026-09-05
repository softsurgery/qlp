export interface ServerErrorResponse {
  message?: string;
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
    status?: number;
  };
}
