import axios, { AxiosError, type AxiosInstance } from "axios";
import { wooEnv } from "../config/env";
import type { WcPaginatedResponse } from "../types/woocommerce";

const DEFAULT_TIMEOUT = wooEnv.timeoutMs;
const DEFAULT_RETRIES = 2;

export class WooApiError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const createWooClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: wooEnv.baseUrl,
    timeout: DEFAULT_TIMEOUT,
  });

  instance.interceptors.request.use((config) => {
    config.auth = {
      username: wooEnv.consumerKey,
      password: wooEnv.consumerSecret,
    };

    config.params = {
      ...(config.params ?? {}),
      consumer_key: wooEnv.consumerKey,
      consumer_secret: wooEnv.consumerSecret,
    };

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: string }>) => {
      const timeoutMessage =
        error.code === "ECONNABORTED"
          ? `Request timed out after ${DEFAULT_TIMEOUT}ms. Check WooCommerce URL/network reachability or increase VITE_WC_TIMEOUT_MS.`
          : undefined;
      const permissionMessage =
        error.response?.status === 401 || error.response?.status === 403
          ? "WooCommerce denied access. API key user likely lacks Admin/Shop Manager capabilities, or key permissions are not Read/Write."
          : undefined;
      const message =
        timeoutMessage ||
        permissionMessage ||
        error.response?.data?.message ||
        error.message ||
        "Unknown WooCommerce API error";
      throw new WooApiError(message, error.response?.status, error.response?.data?.code);
    },
  );

  return instance;
};

export const wooClient = createWooClient();

async function requestWithRetry<T>(
  action: () => Promise<T>,
  retries = DEFAULT_RETRIES,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }

  throw lastError;
}

export async function getWooCollection<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<WcPaginatedResponse<T>> {
  if (!wooEnv.isConfigured) {
    return { items: [], total: 0, totalPages: 0 };
  }

  return requestWithRetry(async () => {
    const response = await wooClient.get<T[]>(endpoint, {
      params: {
        per_page: params.per_page ?? 100,
        ...params,
      },
    });

    return {
      items: response.data,
      total: Number(response.headers["x-wp-total"] ?? 0),
      totalPages: Number(response.headers["x-wp-totalpages"] ?? 0),
    };
  });
}

export async function getWooItem<T>(endpoint: string): Promise<T | null> {
  if (!wooEnv.isConfigured) return null;

  return requestWithRetry(async () => {
    const response = await wooClient.get<T>(endpoint);
    return response.data;
  });
}
