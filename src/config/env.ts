interface WooEnv {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  isConfigured: boolean;
}

const baseUrl = (import.meta.env.VITE_WC_BASE_URL as string | undefined)?.trim() ?? "";
const consumerKey = (import.meta.env.VITE_WC_CONSUMER_KEY as string | undefined)?.trim() ?? "";
const consumerSecret = (import.meta.env.VITE_WC_CONSUMER_SECRET as string | undefined)?.trim() ?? "";

export const wooEnv: WooEnv = {
  baseUrl,
  consumerKey,
  consumerSecret,
  isConfigured: Boolean(baseUrl && consumerKey && consumerSecret),
};
