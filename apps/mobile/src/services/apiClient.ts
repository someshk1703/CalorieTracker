export interface ApiClientOptions {
  baseUrl: string;
  getToken: () => Promise<string | null> | string | null;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryable: boolean
  ) {
    super(message);
  }
}

export function createApiClient(options: ApiClientOptions) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await options.getToken();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

    try {
      const response = await fetch(`${options.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init.headers
        }
      });

      if (!response.ok) {
        throw new ApiClientError(`Request failed with status ${response.status}`, response.status, response.status >= 500);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  return { request };
}