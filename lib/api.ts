import ky from 'ky';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ValidationError {
  code: string;
  message: string;
  path?: string[];
}

interface APIErrorResponse {
  success: boolean;
  error?: ValidationError[];
  result?: unknown;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  result?: T;
}

const apiUrl = 'https://d7e9-106-219-56-51.ngrok-free.app';
console.log(apiUrl);

const createInstance = () => {
  return ky.create({
    prefixUrl: apiUrl,
    retry: 0,
    timeout: false,
  });
};

const instance = createInstance();

const api = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    const cleanUrl = url.replace(/^\//, '');
    const response = await instance.get(cleanUrl).json<ApiResponse<T>>();

    return response;
  },

  post: async <T>(url: string, result?: unknown): Promise<ApiResponse<T>> => {
    const cleanUrl = url.replace(/^\//, '');
    return await instance.post(cleanUrl, { json: result }).json<ApiResponse<T>>();
  },

  put: async <T>(url: string, result?: unknown): Promise<ApiResponse<T>> => {
    const cleanUrl = url.replace(/^\//, '');
    return await instance.put(cleanUrl, { json: result }).json<ApiResponse<T>>();
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const cleanUrl = url.replace(/^\//, '');
    return await instance.delete(cleanUrl).json<ApiResponse<T>>();
  },
};

export default api;
