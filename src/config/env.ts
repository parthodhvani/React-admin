interface WooEnv {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  isConfigured: boolean;
}

function normalizeWooBaseUrl(input: string) {
  const value = input.trim().replace(/\/+$/, "");
  if (!value) return "";

  if (value.includes("/wp-json/wc/v3")) {
    return value;
  }

  return `${value}/wp-json/wc/v3`;
}

const rawBaseUrl = (import.meta.env.VITE_WC_BASE_URL as string | undefined) ?? "";
const baseUrl = normalizeWooBaseUrl(rawBaseUrl);
const consumerKey = (import.meta.env.VITE_WC_CONSUMER_KEY as string | undefined)?.trim() ?? "";
const consumerSecret = (import.meta.env.VITE_WC_CONSUMER_SECRET as string | undefined)?.trim() ?? "";

export const wooEnv: WooEnv = {
  baseUrl,
  consumerKey,
  consumerSecret,
  isConfigured: Boolean(baseUrl && consumerKey && consumerSecret),
};
