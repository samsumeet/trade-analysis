const DEFAULT_BACKEND_API_URL = "http://localhost:3001";

export function getBackendApiBaseUrl() {
  return (
    process.env.TRADE_ANALYSIS_API_URL ??
    process.env.NEXT_PUBLIC_TRADE_ANALYSIS_API_URL ??
    DEFAULT_BACKEND_API_URL
  ).replace(/\/$/, "");
}
