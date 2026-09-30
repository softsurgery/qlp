export interface ServerErrorResponse {
  message?: string;
  response?: {
    data?: {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };
    status?: number;
  };
}

export interface ServerResponse<T> {
  data?: T;
  message?: string;
}
