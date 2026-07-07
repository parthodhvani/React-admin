import { FiAlertTriangle, FiCloudOff, FiLoader } from "react-icons/fi";
import { wooEnv } from "../../config/env";

interface WooStatePanelProps {
  loading?: boolean;
  error?: string;
  title?: string;
}

export function WooStatePanel({ loading, error, title = "WooCommerce data" }: WooStatePanelProps) {
  if (!wooEnv.isConfigured) {
    return (
      <div className="glass soft-card rounded-3xl p-6 text-sm text-slate-600">
        <p className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
          <FiCloudOff /> WooCommerce not configured
        </p>
        <p>Add VITE_WC_BASE_URL, VITE_WC_CONSUMER_KEY, and VITE_WC_CONSUMER_SECRET in .env.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass soft-card rounded-3xl p-6 text-sm text-slate-600">
        <p className="flex items-center gap-2 font-semibold text-slate-800">
          <FiLoader className="animate-spin" /> Loading {title}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass soft-card rounded-3xl p-6 text-sm text-rose-600">
        <p className="mb-1 flex items-center gap-2 font-semibold">
          <FiAlertTriangle /> Failed to load {title}
        </p>
        <p>{error}</p>
      </div>
    );
  }

  return null;
}
